defmodule FusionFlowUI.PublicAPI.NodeControllerTest do
  use FusionFlowUI.ConnCase, async: true

  alias FusionFlowCore.ApiKeys

  import FusionFlowCore.AccountsFixtures

  describe "index" do
    test "lists node definitions with nodes read scope", %{conn: conn} do
      conn =
        conn
        |> authorize(["nodes:read"])
        |> get(~p"/api/v1/nodes")

      assert %{
               "data" => nodes,
               "meta" => %{"page" => 1, "per_page" => 20, "total" => _total, "total_pages" => 1}
             } = json_response(conn, 200)
      assert Enum.any?(nodes, &(&1["type"] == "Start"))
      assert Enum.any?(nodes, &(&1["rete"]["id"] == "Start"))
    end

    test "paginates node definitions", %{conn: conn} do
      conn =
        conn
        |> authorize(["nodes:read"])
        |> get(~p"/api/v1/nodes?page=2&per_page=1")

      assert %{
               "data" => [_node],
               "meta" => %{"page" => 2, "per_page" => 1, "total" => total, "total_pages" => total_pages}
             } = json_response(conn, 200)

      assert total >= 2
      assert total_pages >= 2
    end

    test "requires API key", %{conn: conn} do
      conn = get(conn, ~p"/api/v1/nodes")

      assert %{"error" => %{"code" => "unauthorized", "message" => "Unauthorized"}} =
               json_response(conn, 401)
    end
  end

  describe "show" do
    test "shows one node by slug", %{conn: conn} do
      conn =
        conn
        |> authorize(["nodes:read"])
        |> get(~p"/api/v1/nodes/evaluate-code")

      assert %{
               "data" => %{
                 "type" => "Evaluate Code",
                 "title" => "Evaluate Code",
                 "rete" => %{"id" => "Evaluate Code"}
               }
             } = json_response(conn, 200)
    end

    test "rejects insufficient scope", %{conn: conn} do
      conn =
        conn
        |> authorize(["workflows:read"])
        |> get(~p"/api/v1/nodes")

      assert %{"error" => %{"code" => "forbidden", "message" => "Forbidden"}} =
               json_response(conn, 403)
    end
  end

  defp authorize(conn, scopes) do
    user = user_fixture()
    {:ok, %{token: token}} = ApiKeys.create_api_key(user, %{name: "test key", scopes: scopes})
    put_req_header(conn, "authorization", "Bearer #{token}")
  end
end
