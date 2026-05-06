defmodule FusionFlowWorker.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Oban, Application.fetch_env!(:fusion_flow_worker, Oban)}
    ]

    opts = [strategy: :one_for_one, name: FusionFlowWorker.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
