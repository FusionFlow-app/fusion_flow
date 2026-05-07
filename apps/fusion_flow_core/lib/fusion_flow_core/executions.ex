defmodule FusionFlowCore.Executions do
  @moduledoc """
  Boundary for persisted workflow executions.
  """

  import Ecto.Query, warn: false

  alias FusionFlowCore.Executions.Execution
  alias FusionFlowCore.Flows.Flow
  alias FusionFlowCore.Pagination
  alias FusionFlowCore.Repo

  @flow_execution_worker "FusionFlowWorker.FlowExecutionWorker"
  @public_id_retry_attempts 8
  @public_id_first_words ~w(blue bright calm clear crisp fresh green lean quiet rapid sharp steady swift)
  @public_id_middle_words ~w(axis beacon bridge circuit engine gate grid matrix orbit pulse signal vector)
  @public_id_last_words ~w(channel flow frame path relay route run stream trace vault wave)
  @public_id_suffix_alphabet ~c"23456789abcdefghjkmnpqrstuvwxyz"

  def list_executions do
    Repo.all(from e in Execution, order_by: [desc: e.inserted_at], preload: [:flow])
  end

  def list_executions_for_flow(%Flow{id: flow_id}), do: list_executions_for_flow(flow_id)

  def list_executions_for_flow(flow_id) do
    Repo.all(
      from e in Execution,
        where: e.flow_id == ^flow_id,
        order_by: [desc: e.inserted_at],
        preload: [:flow]
    )
  end

  def list_executions_for_flow_page(flow_or_id, opts \\ %{})

  def list_executions_for_flow_page(%Flow{id: flow_id}, opts), do: list_executions_for_flow_page(flow_id, opts)

  def list_executions_for_flow_page(flow_id, opts) do
    opts
    |> Map.new()
    |> Map.put(:workflow_id, flow_id)
    |> list_executions_page()
  end

  def list_executions_page(opts \\ %{}) do
    Execution
    |> filter_by_workflow_id(opts)
    |> filter_by_status(opts)
    |> filter_by_inserted_after(opts)
    |> filter_by_inserted_before(opts)
    |> order_by([e], desc: e.inserted_at)
    |> preload([:flow])
    |> Pagination.paginate(Repo, opts)
  end

  def get_execution!(id) do
    Execution
    |> Repo.get!(id)
    |> Repo.preload(:flow)
  end

  def get_execution_by_public_id!(public_id) do
    Execution
    |> Repo.get_by!(public_id: public_id)
    |> Repo.preload(:flow)
  end

  def get_execution_by_flow_and_public_id(flow_id, public_id) do
    Execution
    |> Repo.get_by(flow_id: flow_id, public_id: public_id)
    |> Repo.preload(:flow)
  end

  def subscribe_to_execution(%Execution{id: execution_id}) do
    subscribe_to_execution(execution_id)
  end

  def subscribe_to_execution(execution_id) do
    Phoenix.PubSub.subscribe(FusionFlowCore.PubSub, execution_topic(execution_id))
  end

  def broadcast_execution_updated(%Execution{} = execution) do
    execution = Repo.preload(execution, :flow)

    Phoenix.PubSub.broadcast(
      FusionFlowCore.PubSub,
      execution_topic(execution.id),
      {:execution_updated, execution}
    )

    :ok
  end

  def create_execution(attrs \\ %{}) do
    attrs =
      attrs
      |> Map.new()
      |> Map.put_new(:status, "queued")
      |> Map.put_new(:input, %{})
      |> Map.put_new(:logs, [])

    if public_id_present?(attrs) do
      insert_execution(attrs)
    else
      insert_with_public_id(attrs, @public_id_retry_attempts)
    end
  end

  def enqueue_execution(%Execution{} = execution) do
    %{execution_id: execution.id}
    |> Oban.Job.new(queue: :executions, worker: @flow_execution_worker, max_attempts: 3)
    |> then(&Oban.insert(oban_name(), &1))
  end

  defp oban_name do
    Application.get_env(:fusion_flow_core, :oban_name, FusionFlowCore.Oban)
  end

  def update_execution(%Execution{} = execution, attrs) do
    execution
    |> Execution.changeset(attrs)
    |> Repo.update()
  end

  def change_execution(%Execution{} = execution, attrs \\ %{}) do
    Execution.changeset(execution, attrs)
  end

  def mark_running(%Execution{} = execution, attrs \\ %{}) do
    execution
    |> Execution.changeset(
      attrs
      |> Map.new()
      |> Map.merge(%{
        status: "running",
        started_at: timestamp()
      })
    )
    |> Repo.update()
  end

  def mark_succeeded(%Execution{} = execution, result, attrs \\ %{}) do
    execution
    |> Execution.changeset(
      attrs
      |> Map.new()
      |> Map.merge(%{
        status: "succeeded",
        result: normalize_map(result),
        error: nil,
        finished_at: timestamp()
      })
    )
    |> Repo.update()
  end

  def mark_failed(%Execution{} = execution, error, attrs \\ %{}) do
    execution
    |> Execution.changeset(
      attrs
      |> Map.new()
      |> Map.merge(%{
        status: "failed",
        error: normalize_error(error),
        finished_at: timestamp()
      })
    )
    |> Repo.update()
  end

  def append_log(%Execution{} = execution, log_entry) when is_map(log_entry) do
    update_execution(execution, %{logs: execution.logs ++ [log_entry]})
  end

  def append_log(%Execution{} = execution, log_entry) do
    append_log(execution, %{"message" => to_string(log_entry)})
  end

  def generate_public_id do
    [
      random_word(@public_id_first_words),
      random_word(@public_id_middle_words),
      random_word(@public_id_last_words)
    ]
    |> Enum.join("-")
  end

  defp insert_with_public_id(attrs, attempts_remaining) when attempts_remaining > 0 do
    attrs = Map.put(attrs, :public_id, generate_public_id())

    case insert_execution(attrs) do
      {:error, changeset} ->
        cond do
          public_id_collision?(changeset) && attempts_remaining > 1 ->
            insert_with_public_id(Map.delete(attrs, :public_id), attempts_remaining - 1)

          public_id_collision?(changeset) ->
            insert_with_public_id(Map.delete(attrs, :public_id), 0)

          true ->
            {:error, changeset}
        end

      result ->
        result
    end
  end

  defp insert_with_public_id(attrs, 0) do
    attrs = Map.put(attrs, :public_id, "#{generate_public_id()}-#{random_suffix()}")

    case insert_execution(attrs) do
      {:error, changeset} ->
        if public_id_collision?(changeset),
          do: insert_with_public_id(Map.delete(attrs, :public_id), 0),
          else: {:error, changeset}

      result ->
        result
    end
  end

  defp public_id_present?(attrs) do
    public_id = Map.get(attrs, :public_id) || Map.get(attrs, "public_id")
    is_binary(public_id) && public_id != ""
  end

  defp insert_execution(attrs) do
    %Execution{}
    |> Execution.changeset(attrs)
    |> Repo.insert()
  end

  defp public_id_collision?(%Ecto.Changeset{errors: errors}) do
    Enum.any?(errors, fn
      {:public_id, {_message, opts}} -> opts[:constraint] == :unique
      _error -> false
    end)
  end

  defp random_word(words) do
    Enum.at(words, :rand.uniform(length(words)) - 1)
  end

  defp random_suffix do
    1..4
    |> Enum.map(fn _index ->
      <<Enum.at(@public_id_suffix_alphabet, :rand.uniform(length(@public_id_suffix_alphabet)) - 1)>>
    end)
    |> Enum.join()
  end

  defp timestamp do
    DateTime.utc_now(:second)
  end

  defp execution_topic(execution_id), do: "executions:#{execution_id}"

  defp filter_by_workflow_id(query, opts) do
    case Map.get(opts, :workflow_id) || Map.get(opts, "workflow_id") do
      nil ->
        query

      workflow_id when is_integer(workflow_id) ->
        where(query, [e], e.flow_id == ^workflow_id)

      workflow_id when is_binary(workflow_id) ->
        case Integer.parse(workflow_id) do
          {id, ""} -> where(query, [e], e.flow_id == ^id)
          _ -> query
        end

      _ ->
        query
    end
  end

  defp filter_by_status(query, opts) do
    case Map.get(opts, :status) || Map.get(opts, "status") do
      status when is_binary(status) ->
        if status in Execution.statuses() do
          where(query, [e], e.status == ^status)
        else
          query
        end

      _ ->
        query
    end
  end

  defp filter_by_inserted_after(query, opts) do
    case parse_datetime(Map.get(opts, :inserted_after) || Map.get(opts, "inserted_after")) do
      {:ok, datetime} -> where(query, [e], e.inserted_at >= ^datetime)
      :error -> query
    end
  end

  defp filter_by_inserted_before(query, opts) do
    case parse_datetime(Map.get(opts, :inserted_before) || Map.get(opts, "inserted_before")) do
      {:ok, datetime} -> where(query, [e], e.inserted_at <= ^datetime)
      :error -> query
    end
  end

  defp parse_datetime(nil), do: :error

  defp parse_datetime(%DateTime{} = datetime), do: {:ok, datetime}

  defp parse_datetime(value) when is_binary(value) do
    case DateTime.from_iso8601(value) do
      {:ok, datetime, _offset} -> {:ok, datetime}
      _ -> :error
    end
  end

  defp parse_datetime(_value), do: :error

  defp normalize_map(%{} = value), do: value
  defp normalize_map(value), do: %{"result" => value}

  defp normalize_error(%{} = error), do: error
  defp normalize_error(error) when is_binary(error), do: %{"message" => error}
  defp normalize_error(error), do: %{"message" => inspect(error)}
end
