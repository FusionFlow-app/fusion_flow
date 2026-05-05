defmodule FusionFlowCore.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      FusionFlowCore.Repo,
      {Phoenix.PubSub, name: FusionFlowCore.PubSub},
      FusionFlowCore.Webhooks.Registry,
      FusionFlowCore.Flows.Cache
    ]

    opts = [strategy: :one_for_one, name: FusionFlowCore.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
