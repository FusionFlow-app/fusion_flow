defmodule FusionFlowUI.PublicAPI.WorkflowControllerTest do
  use FusionFlowUI.ConnCase, async: true

  alias FusionFlowCore.ApiKeys
  alias FusionFlowCore.Flows

  import FusionFlowCore.AccountsFixtures
  import FusionFlowCore.FlowsFixtures

  describe "index" do
    test "lists workflows with read scope", %{conn: conn} do
      user = user_fixture()
      _workflow = flow_fixture(%{user: user})
      _other_workflow = flow_fixture()

      conn =
        conn
        |> authorize(user, ["workflows:read"])
        |> get(~p"/api/v1/workflows")

      assert %{
               "data" => [%{"name" => "Test Flow"}],
               "meta" => %{"page" => 1, "per_page" => 20, "total" => 1, "total_pages" => 1}
             } = json_response(conn, 200)
    end

    test "paginates workflows", %{conn: conn} do
      user = user_fixture()
      _flow_1 = flow_fixture(%{user: user, name: "Flow A"})
      _flow_2 = flow_fixture(%{user: user, name: "Flow B"})

      conn =
        conn
        |> authorize(user, ["workflows:read"])
        |> get(~p"/api/v1/workflows?page=2&per_page=1")

      assert %{
               "data" => [%{"name" => _name}],
               "meta" => %{"page" => 2, "per_page" => 1, "total" => 2, "total_pages" => 2}
             } = json_response(conn, 200)
    end

    test "requires API key", %{conn: conn} do
      conn = get(conn, ~p"/api/v1/workflows")

      assert %{"error" => %{"code" => "unauthorized", "message" => "Unauthorized"}} =
               json_response(conn, 401)
    end

    test "rejects insufficient scope", %{conn: conn} do
      conn =
        conn
        |> authorize(["workflows:write"])
        |> get(~p"/api/v1/workflows")

      assert %{"error" => %{"code" => "forbidden", "message" => "Forbidden"}} =
               json_response(conn, 403)
    end
  end

  describe "create" do
    test "creates workflow with write scope", %{conn: conn} do
      attrs = %{name: "API workflow", nodes: [], connections: []}

      conn =
        conn
        |> authorize(["workflows:write"])
        |> post(~p"/api/v1/workflows", workflow: attrs)

      assert %{"data" => %{"id" => _id, "name" => "API workflow"}} =
               json_response(conn, :created)
    end

    test "creates workflow with valid graph", %{conn: conn} do
      attrs = valid_graph_attrs(%{name: "Graph workflow"})

      conn =
        conn
        |> authorize(["workflows:write"])
        |> post(~p"/api/v1/workflows", workflow: attrs)

      assert %{"data" => %{"name" => "Graph workflow", "nodes" => nodes}} =
               json_response(conn, :created)

      assert length(nodes) == 2
    end

    test "rejects workflow with invalid graph", %{conn: conn} do
      attrs =
        valid_graph_attrs(%{name: "Invalid graph"})
        |> update_in([:nodes], fn [node | rest] -> [Map.put(node, "module", "System") | rest] end)

      conn =
        conn
        |> authorize(["workflows:write"])
        |> post(~p"/api/v1/workflows", workflow: attrs)

      assert %{
               "error" => %{
                 "code" => "validation_error",
                 "message" => "Validation failed",
                 "details" => %{"nodes" => ["contains unknown node fields"]}
               }
             } = json_response(conn, :unprocessable_entity)
    end
  end

  describe "show" do
    test "shows workflow with read scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})

      conn =
        conn
        |> authorize(user, ["workflows:read"])
        |> get(~p"/api/v1/workflows/#{workflow}")

      assert %{"data" => %{"id" => id, "name" => "Test Flow"}} = json_response(conn, 200)
      assert id == workflow.id
    end

    test "does not show another user's workflow", %{conn: conn} do
      workflow = flow_fixture()

      conn = conn |> authorize(["workflows:read"]) |> get(~p"/api/v1/workflows/#{workflow}")

      assert %{"error" => %{"code" => "not_found", "message" => "Not Found"}} =
               json_response(conn, 404)
    end
  end

  describe "update" do
    test "updates workflow with write scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})

      conn =
        conn
        |> authorize(user, ["workflows:write"])
        |> patch(~p"/api/v1/workflows/#{workflow}", workflow: %{name: "Updated"})

      assert %{"data" => %{"name" => "Updated"}} = json_response(conn, 200)
    end
  end

  describe "delete" do
    test "deletes workflow with delete scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})

      conn =
        conn
        |> authorize(user, ["workflows:delete"])
        |> delete(~p"/api/v1/workflows/#{workflow}")

      assert response(conn, :no_content)
      assert_raise Ecto.NoResultsError, fn -> Flows.get_flow!(workflow.id) end
    end
  end

  defp authorize(conn, scopes) do
    user = user_fixture()
    authorize(conn, user, scopes)
  end

  defp authorize(conn, user, scopes) do
    {:ok, %{token: token}} = ApiKeys.create_api_key(user, %{name: "test key", scopes: scopes})
    put_req_header(conn, "authorization", "Bearer #{token}")
  end

  defp valid_graph_attrs(attrs) do
    Map.merge(
      %{
        name: "Graph workflow",
        nodes: [
          %{
            "id" => "start",
            "type" => "Start",
            "label" => "Start",
            "controls" => %{},
            "position" => %{"x" => 0, "y" => 0}
          },
          %{
            "id" => "output",
            "type" => "Output",
            "label" => "Output",
            "controls" => %{},
            "position" => %{"x" => 200, "y" => 0}
          }
        ],
        connections: [
          %{
            "source" => "start",
            "sourceOutput" => "exec",
            "target" => "output",
            "targetInput" => "exec"
          }
        ]
      },
      attrs
    )
  end
end
