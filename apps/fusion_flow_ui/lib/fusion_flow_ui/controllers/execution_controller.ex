defmodule FusionFlowUI.ExecutionController do
  use FusionFlowUI, :controller

  alias FusionFlowCore.Executions

  action_fallback FusionFlowUI.FallbackController

  def show(conn, %{"flow_id" => flow_id, "public_id" => public_id}) do
    case Executions.get_execution_by_flow_and_public_id(flow_id, public_id) do
      nil ->
        {:error, :not_found}

      execution ->
        render(conn, :show, execution: execution)
    end
  end
end
