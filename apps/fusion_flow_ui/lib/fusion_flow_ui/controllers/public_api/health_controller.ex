defmodule FusionFlowUI.PublicAPI.HealthController do
  use FusionFlowUI, :controller

  def show(conn, _params) do
    json(conn, %{status: "ok"})
  end
end
