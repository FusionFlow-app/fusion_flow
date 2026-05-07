defmodule FusionFlowUI.PublicAPI.V1.HealthController do
  use FusionFlowUI, :controller

  def show(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
