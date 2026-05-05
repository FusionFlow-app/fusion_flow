defmodule FusionFlowWeb.ExecutionController do
  use FusionFlowWeb, :controller

  alias FusionFlow.Executions

  action_fallback FusionFlowWeb.FallbackController

  def show(conn, %{"flow_id" => flow_id, "public_id" => public_id}) do
    case Executions.get_execution_by_flow_and_public_id(flow_id, public_id) do
      nil ->
        {:error, :not_found}

      execution ->
        render(conn, :show, execution: execution)
    end
  end
end
