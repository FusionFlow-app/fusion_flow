defmodule FusionFlowUI.ApiNotFoundController do
  use FusionFlowUI, :controller

  def show(conn, _params) do
    conn
    |> put_status(:not_found)
    |> put_view(json: FusionFlowUI.ErrorJSON)
    |> render(:"404")
  end
end
