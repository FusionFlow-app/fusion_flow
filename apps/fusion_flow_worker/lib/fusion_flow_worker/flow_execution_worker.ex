defmodule FusionFlowWorker.FlowExecutionWorker do
  @moduledoc """
  Oban worker responsible for running persisted flow executions.
  """

  use Oban.Worker, queue: :executions, max_attempts: 3

  alias FusionFlowCore.Executions
  alias FusionFlowCore.Flows
  alias FusionFlowNodes.Runner

  @internal_result_keys ["flow_id", "logs"]

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"execution_id" => execution_id}}) do
    execution = Executions.get_execution!(execution_id)
    flow = Flows.get_flow!(execution.flow_id)

    with {:ok, running_execution} <- Executions.mark_running(execution) do
      case run_flow(flow, running_execution.input) do
        {:ok, context} ->
          persist_success(running_execution, context)

        {:error, reason, node_id} ->
          persist_failure(running_execution, reason, node_id)
      end
    end
  end

  def perform(%Oban.Job{args: args}) do
    {:error, {:missing_execution_id, args}}
  end

  defp run_flow(flow, %{"trigger" => "webhook", "request" => request}) do
    Runner.run_from_webhook(flow, request)
  end

  defp run_flow(flow, input) do
    Runner.run(flow, input)
  end

  defp persist_success(execution, context) do
    logs = Map.get(context, "logs", [])
    result = Map.drop(context, @internal_result_keys)

    case Executions.mark_succeeded(execution, result, %{logs: logs}) do
      {:ok, execution} ->
        Executions.broadcast_execution_updated(execution)
        :ok

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  defp persist_failure(execution, reason, node_id) do
    error =
      %{
        "message" => format_reason(reason)
      }
      |> maybe_put_node_id(node_id)

    case Executions.mark_failed(execution, error) do
      {:ok, execution} ->
        Executions.broadcast_execution_updated(execution)
        :ok

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  defp maybe_put_node_id(error, nil), do: error
  defp maybe_put_node_id(error, node_id), do: Map.put(error, "node_id", to_string(node_id))

  defp format_reason(reason) when is_binary(reason), do: reason
  defp format_reason(reason), do: inspect(reason)
end
