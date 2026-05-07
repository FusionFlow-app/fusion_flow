defmodule FusionFlowUI.PublicAPI.WorkflowController do
  use FusionFlowUI, :controller

  alias FusionFlowCore.Flows
  alias FusionFlowCore.Flows.Flow
  alias FusionFlowUI.Pagination

  action_fallback FusionFlowUI.FallbackController

  plug FusionFlowUI.Plugs.RequireApiScope, ["workflows:read"] when action in [:index, :show]
  plug FusionFlowUI.Plugs.RequireApiScope, ["workflows:write"] when action in [:create, :update]
  plug FusionFlowUI.Plugs.RequireApiScope, ["workflows:delete"] when action in [:delete]

  def index(conn, params) do
    result =
      params
      |> Pagination.from_params()
      |> then(&Flows.list_flows_page(conn.assigns.current_scope, &1))

    render(conn, :index, workflows: result.entries, meta: pagination_meta(result))
  end

  def create(conn, %{"workflow" => workflow_params}) do
    with {:ok, %Flow{} = workflow} <-
           Flows.create_flow(conn.assigns.current_scope, workflow_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/v1/workflows/#{workflow}")
      |> render(:show, workflow: workflow)
    end
  end

  def show(conn, %{"id" => id}) do
    case Flows.get_flow(conn.assigns.current_scope, id) do
      nil -> {:error, :not_found}
      workflow -> render(conn, :show, workflow: workflow)
    end
  end

  def update(conn, %{"id" => id, "workflow" => workflow_params}) do
    case Flows.get_flow(conn.assigns.current_scope, id) do
      nil ->
        {:error, :not_found}

      workflow ->
        with {:ok, %Flow{} = workflow} <-
               Flows.update_flow(conn.assigns.current_scope, workflow, workflow_params) do
          render(conn, :show, workflow: workflow)
        end
    end
  end

  def delete(conn, %{"id" => id}) do
    case Flows.get_flow(conn.assigns.current_scope, id) do
      nil ->
        {:error, :not_found}

      workflow ->
        with {:ok, %Flow{}} <- Flows.delete_flow(conn.assigns.current_scope, workflow) do
          send_resp(conn, :no_content, "")
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
