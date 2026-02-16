defmodule FusionFlowWeb.FlowController do
  use FusionFlowWeb, :controller

  alias FusionFlow.Flows
  alias FusionFlow.Flows.Flow

  action_fallback FusionFlowWeb.FallbackController

  def index(conn, _params) do
    flows = Flows.list_flows()
    render(conn, :index, flows: flows)
  end

  def create(conn, %{"flow" => flow_params}) do
    with {:ok, %Flow{} = flow} <- Flows.create_flow(flow_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/flows/#{flow}")
      |> render(:show, flow: flow)
    end
  end

  def show(conn, %{"id" => id}) do
    flow = Flows.get_flow!(id)
    render(conn, :show, flow: flow)
  end

  def update(conn, %{"id" => id, "flow" => flow_params}) do
    flow = Flows.get_flow!(id)

    with {:ok, %Flow{} = flow} <- Flows.update_flow(flow, flow_params) do
      render(conn, :show, flow: flow)
    end
  end

  def delete(conn, %{"id" => id}) do
    flow = Flows.get_flow!(id)

    with {:ok, %Flow{}} <- Flows.delete_flow(flow) do
      send_resp(conn, :no_content, "")
    end
  end
end
