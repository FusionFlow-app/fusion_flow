defmodule FusionFlowCore.Webhooks.Registry do
  @moduledoc """
  GenServer that manages an ETS table for fast webhook lookups.
  Keys are `{flow_id, slug}` tuples. Populated from the database on startup.
  """

  use GenServer

  @table :webhook_registry

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, [], name: __MODULE__)
  end

  def lookup(flow_id, slug) do
    key = {flow_id, slug}

    case :ets.lookup(@table, key) do
      [{^key, data}] -> {:ok, data}
      [] -> :error
    end
  end

  def register(%{token: token, flow_id: flow_id, method: method}) do
    key = {flow_id, token}
    :ets.insert(@table, {key, %{flow_id: flow_id, method: method, token: token}})
    :ok
  end

  def unregister(flow_id, token) do
    :ets.delete(@table, {flow_id, token})
    :ok
  end

  @impl true
  def init(_) do
    :ets.new(@table, [:named_table, :set, :public, read_concurrency: true])

    Task.start(fn ->
      FusionFlowCore.Webhooks.sync_all()
    end)

    {:ok, %{}}
  end
end
