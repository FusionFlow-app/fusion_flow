defmodule FusionFlowAI.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      {Finch, name: FusionFlowAI.Finch}
    ]

    opts = [strategy: :one_for_one, name: FusionFlowAI.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
