defmodule FusionFlowCore.Flows do
  @moduledoc """
  The Flows context.
  """

  import Ecto.Query, warn: false
  alias FusionFlowCore.Repo

  alias FusionFlowCore.Flows.Flow

  @doc """
  Returns the list of flows.

  ## Examples

      iex> list_flows()
      [%Flow{}, ...]

  """
  def list_flows do
    Repo.all(Flow)
  end

  @doc """
  Gets a single flow.

  Raises `Ecto.NoResultsError` if the Flow does not exist.

  ## Examples

      iex> get_flow!(123)
      %Flow{}

      iex> get_flow!(456)
      ** (Ecto.NoResultsError)

  """
  def get_flow!(id), do: Repo.get!(Flow, id)

  @doc """
  Creates a flow.

  ## Examples

      iex> create_flow(%{field: value})
      {:ok, %Flow{}}

      iex> create_flow(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_flow(attrs \\ %{}) do
    result =
      %Flow{}
      |> Flow.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, flow} ->
        FusionFlowCore.Webhooks.register_flow(flow)
        {:ok, flow}

      error ->
        error
    end
  end

  @doc """
  Updates a flow.

  ## Examples

      iex> update_flow(flow, %{field: new_value})
      {:ok, %Flow{}}

      iex> update_flow(flow, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_flow(%Flow{} = flow, attrs) do
    result =
      flow
      |> Flow.changeset(attrs)
      |> Repo.update()

    case result do
      {:ok, updated_flow} ->
        FusionFlowCore.Flows.Cache.invalidate(updated_flow.id)
        FusionFlowCore.Webhooks.register_flow(updated_flow)
        {:ok, updated_flow}

      error ->
        error
    end
  end

  @doc """
  Deletes a flow.

  ## Examples

      iex> delete_flow(flow)
      {:ok, %Flow{}}

      iex> delete_flow(flow)
      {:error, %Ecto.Changeset{}}

  """
  def delete_flow(%Flow{} = flow) do
    FusionFlowCore.Flows.Cache.invalidate(flow.id)
    FusionFlowCore.Webhooks.unregister_flow(flow)
    Repo.delete(flow)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking flow changes.

  ## Examples

      iex> change_flow(flow)
      %Ecto.Changeset{data: %Flow{}}

  """
  def change_flow(%Flow{} = flow, attrs \\ %{}) do
    Flow.changeset(flow, attrs)
  end

  @doc """
  Gets the first flow or creates a default one if none exist.
  """
  def get_first_or_create_default_flow do
    case Repo.one(from f in Flow, limit: 1) do
      nil -> create_flow(%{name: "My First Flow", nodes: [], connections: []})
      flow -> {:ok, flow}
    end
  end

  alias FusionFlowCore.Flows.ExecutionLog

  @doc """
  Creates a flow execution log.
  """
  def create_execution_log(attrs \\ %{}) do
    %ExecutionLog{}
    |> ExecutionLog.changeset(attrs)
    |> Repo.insert()
  end
end
