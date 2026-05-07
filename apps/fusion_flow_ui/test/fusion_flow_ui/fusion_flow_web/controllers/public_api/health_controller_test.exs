defmodule FusionFlowUI.PublicAPI.HealthControllerTest do
  use FusionFlowUI.ConnCase, async: true

  test "returns ok without API key", %{conn: conn} do
    conn = get(conn, ~p"/api/v1/health")

    assert %{"status" => "ok"} = json_response(conn, 200)
  end
end
