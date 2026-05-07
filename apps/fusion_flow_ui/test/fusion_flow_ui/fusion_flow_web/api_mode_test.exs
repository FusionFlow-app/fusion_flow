defmodule FusionFlowUI.ApiModeTest do
  use FusionFlowUI.ConnCase, async: false

  alias FusionFlowCore.ApiKeys
  import FusionFlowCore.AccountsFixtures
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
    user = user_fixture()
    flow = flow_fixture(%{user: user})

    conn = conn |> authorize(user, ["workflows:read"]) |> get(~p"/api/v1/workflows/#{flow}")

    assert %{"data" => %{"id" => id, "name" => "Test Flow"}} = json_response(conn, 200)
    assert id == flow.id
  end

  test "serves health route without API key", %{conn: conn} do
    conn = get(conn, ~p"/api/v1/health")

    assert %{"status" => "ok"} = json_response(conn, 200)
  end

  test "does not expose visual routes", %{conn: conn} do
    conn = get(conn, ~p"/flows")

    assert %{"error" => %{"code" => "not_found", "message" => "Not Found"}} =
             json_response(conn, 404)
  end

  test "does not expose LiveView socket route", %{conn: conn} do
    conn = get(conn, "/live")

    assert %{"error" => %{"code" => "not_found", "message" => "Not Found"}} =
             json_response(conn, 404)
  end

  test "selects the API endpoint for api mode" do
    assert FusionFlowUI.Mode.endpoint() == FusionFlowUI.ApiEndpoint
  end

  defp authorize(conn, user, scopes) do
    {:ok, %{token: token}} = ApiKeys.create_api_key(user, %{name: "test key", scopes: scopes})
    put_req_header(conn, "authorization", "Bearer #{token}")
  end
end
