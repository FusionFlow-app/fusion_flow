defmodule FusionFlow.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    try do
      Pythonx.uv_init("""
      [project]
      name = "fusion_flow"
      version = "0.1.0"
      requires-python = ">=3.11"
      dependencies = []
      """)
    rescue
      e ->
        require Logger
        Logger.warning("Pythonx init skipped: #{Exception.message(e)}")
    end

    children = [
      FusionFlowWeb.Telemetry,
      FusionFlow.Repo,
      {DNSCluster, query: Application.get_env(:fusion_flow, :dns_cluster_query) || :ignore},
      {Oban, Application.fetch_env!(:fusion_flow, Oban)},
      {Phoenix.PubSub, name: FusionFlow.PubSub},
      {Finch, name: FusionFlow.Finch},
      FusionFlowWeb.Endpoint
    ]

    opts = [strategy: :one_for_one, name: FusionFlow.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    FusionFlowWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
