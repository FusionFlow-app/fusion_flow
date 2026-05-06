defmodule FusionFlowUI.ApiModeTest do
  use FusionFlowUI.ConnCase, async: false

  import FusionFlowCore.FlowsFixtures

  @endpoint FusionFlowUI.ApiEndpoint

  setup do
    previous_mode = System.get_env("FUSION_FLOW_UI_MODE")
    System.put_env("FUSION_FLOW_UI_MODE", "api")
    start_supervised!(FusionFlowUI.ApiEndpoint)

    on_exit(fn ->
      if previous_mode do
        System.put_env("FUSION_FLOW_UI_MODE", previous_mode)
      else
        System.delete_env("FUSION_FLOW_UI_MODE")
      end
    end)
  end

  test "serves API routes", %{conn: conn} do
    flow = flow_fixture()

    conn = get(conn, ~p"/api/flows/#{flow}")

    assert %{"data" => %{"id" => id, "name" => "Test Flow"}} = json_response(conn, 200)
    assert id == flow.id
  end

  test "does not expose visual routes", %{conn: conn} do
    conn = get(conn, ~p"/flows")

    assert %{"errors" => %{"detail" => "Not Found"}} = json_response(conn, 404)
  end

  test "does not expose LiveView socket route", %{conn: conn} do
    conn = get(conn, "/live")

    assert %{"errors" => %{"detail" => "Not Found"}} = json_response(conn, 404)
  end

  test "selects the API endpoint for api mode" do
    assert FusionFlowUI.Mode.endpoint() == FusionFlowUI.ApiEndpoint
  end
end
