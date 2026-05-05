defmodule FusionFlowUI.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      FusionFlowUI.Telemetry,
      {DNSCluster, query: Application.get_env(:fusion_flow_ui, :dns_cluster_query) || :ignore},
      {Oban, Application.fetch_env!(:fusion_flow_core, Oban)},
      FusionFlowUI.Endpoint
    ]

    opts = [strategy: :one_for_one, name: FusionFlowUI.Supervisor]
    Supervisor.start_link(children, opts)
  end

  @impl true
  def config_change(changed, _new, removed) do
    FusionFlowUI.Endpoint.config_change(changed, removed)
    :ok
  end
end
