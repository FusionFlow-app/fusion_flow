defmodule FusionFlowCore.Flows.Cache do
  @moduledoc """
  ETS-backed cache for flows by id. Used by the webhook plug to avoid
  a DB round-trip on every request for hot flows. Invalidated on update/delete.
  """

  use GenServer

  @table :flow_cache

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  @doc "Returns the flow from cache or nil."
  def get(flow_id) when is_integer(flow_id) do
    case :ets.lookup(@table, flow_id) do
      [{^flow_id, flow}] -> flow
      [] -> nil
    end
  end

  def get(flow_id) when is_binary(flow_id) do
    case Integer.parse(flow_id) do
      {id, _} -> get(id)
      :error -> nil
    end
  end

  @doc "Stores the flow in cache. Key is flow.id."
  def put(%struct{} = flow) when struct == FusionFlowCore.Flows.Flow do
    :ets.insert(@table, {flow.id, flow})
    :ok
  end

  @doc "Removes the flow from cache (call after update or delete)."
  def invalidate(flow_id) when is_integer(flow_id) do
    :ets.delete(@table, flow_id)
    :ok
  end

  def invalidate(flow_id) when is_binary(flow_id) do
    case Integer.parse(flow_id) do
      {id, _} -> invalidate(id)
      :error -> :ok
    end
  end

  @impl true
  def init(_opts) do
    :ets.new(@table, [:named_table, :set, :public, read_concurrency: true])
    {:ok, %{}}
  end
end
