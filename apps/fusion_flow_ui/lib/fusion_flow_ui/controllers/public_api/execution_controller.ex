defmodule FusionFlowUI.PublicAPI.ExecutionController do
  use FusionFlowUI, :controller

  alias FusionFlowCore.Executions
  alias FusionFlowCore.Executions.Execution
  alias FusionFlowCore.Flows
  alias FusionFlowUI.Pagination

  action_fallback FusionFlowUI.FallbackController

  plug FusionFlowUI.Plugs.RequireApiScope, ["executions:read"] when action in [:index, :show]
  plug FusionFlowUI.Plugs.RequireApiScope, ["executions:write"] when action in [:create]

  def index(conn, %{"workflow_id" => workflow_id}) do
    case Flows.get_flow(conn.assigns.current_scope, workflow_id) do
      nil ->
        {:error, :not_found}

      workflow ->
        result =
          conn.params
          |> Map.merge(Pagination.from_params(conn.params))
          |> then(&Executions.list_executions_for_flow_page(workflow, &1))

        render(conn, :index, executions: result.entries, meta: pagination_meta(result))
    end
  end

  def create(conn, %{"workflow_id" => workflow_id} = params) do
    case Flows.get_flow(conn.assigns.current_scope, workflow_id) do
      nil ->
        {:error, :not_found}

      workflow ->
        input = params |> Map.get("input", %{}) |> Map.put_new("trigger", "api")

        with {:ok, %Execution{} = execution} <-
               Executions.create_execution(%{flow_id: workflow.id, input: input}),
             {:ok, _job} <- Executions.enqueue_execution(execution) do
          conn
          |> put_status(:accepted)
          |> put_resp_header(
            "location",
            ~p"/api/v1/workflows/#{workflow}/executions/#{execution.public_id}"
          )
          |> render(:show, execution: execution)
        end
    end
  end

  def show(conn, %{"workflow_id" => workflow_id, "public_id" => public_id}) do
    case Flows.get_flow(conn.assigns.current_scope, workflow_id) do
      nil ->
        {:error, :not_found}

      workflow ->
        case Executions.get_execution_by_flow_and_public_id(workflow.id, public_id) do
          nil -> {:error, :not_found}
          execution -> render(conn, :show, execution: execution)
        end
    end
  end

  defp pagination_meta(result) do
    %{
      page: result.page,
      per_page: result.per_page,
      total: result.total,
      total_pages: result.total_pages
    }
  end
end
