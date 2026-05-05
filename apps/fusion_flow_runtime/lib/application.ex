defmodule FusionFlowRuntime.Application do
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    init_pythonx()
    Supervisor.start_link([], strategy: :one_for_one, name: FusionFlowRuntime.Supervisor)
  end

  defp init_pythonx do
    Pythonx.uv_init("""
    [project]
    name = "fusion_flow_runtime"
    version = "0.1.0"
    requires-python = ">=3.11"
    dependencies = []
    """)
  rescue
    e ->
      require Logger
      Logger.warning("Pythonx init skipped: #{Exception.message(e)}")
  end
end
