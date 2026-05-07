defmodule FusionFlowUI.PublicAPI.ExecutionControllerTest do
  use FusionFlowUI.ConnCase, async: true

  alias FusionFlowCore.ApiKeys
  alias FusionFlowCore.Executions
  alias FusionFlowCore.Repo

  import Ecto.Query

  import FusionFlowCore.AccountsFixtures
  import FusionFlowCore.FlowsFixtures

  describe "index" do
    test "lists workflow executions with read scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      execution = execution_fixture(%{flow: workflow})

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(~p"/api/v1/workflows/#{workflow.id}/executions")

      assert %{
               "data" => [%{"id" => public_id, "workflow_id" => workflow_id}],
               "meta" => %{"page" => 1, "per_page" => 20, "total" => 1, "total_pages" => 1}
             } = json_response(conn, 200)

      assert public_id == execution.public_id
      assert workflow_id == workflow.id
    end

    test "paginates executions", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      _execution_1 = execution_fixture(%{flow: workflow})
      _execution_2 = execution_fixture(%{flow: workflow})

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(~p"/api/v1/workflows/#{workflow.id}/executions?page=2&per_page=1")

      assert %{
               "data" => [%{"id" => _public_id}],
               "meta" => %{"page" => 2, "per_page" => 1, "total" => 2, "total_pages" => 2}
             } = json_response(conn, 200)
    end

    test "filters executions by status", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      succeeded = execution_fixture(%{flow: workflow, status: "succeeded"})
      _failed = execution_fixture(%{flow: workflow, status: "failed"})

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(~p"/api/v1/workflows/#{workflow.id}/executions?status=succeeded")

      assert %{
               "data" => [%{"id" => public_id, "status" => "succeeded"}],
               "meta" => %{"total" => 1}
             } = json_response(conn, 200)

      assert public_id == succeeded.public_id
    end

    test "filters executions by inserted_at window", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      older = execution_fixture(%{flow: workflow})
      newer = execution_fixture(%{flow: workflow})
      older_time = DateTime.add(DateTime.utc_now(:second), -600, :second)
      newer_time = DateTime.add(DateTime.utc_now(:second), -60, :second)

      from(e in Executions.Execution, where: e.id == ^older.id)
      |> Repo.update_all(set: [inserted_at: older_time, updated_at: older_time])

      from(e in Executions.Execution, where: e.id == ^newer.id)
      |> Repo.update_all(set: [inserted_at: newer_time, updated_at: newer_time])

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(
          ~p"/api/v1/workflows/#{workflow.id}/executions?inserted_after=#{DateTime.to_iso8601(newer_time)}&inserted_before=#{DateTime.to_iso8601(DateTime.add(newer_time, 10, :second))}"
        )

      assert %{
               "data" => [%{"id" => public_id}],
               "meta" => %{"total" => 1}
             } = json_response(conn, 200)

      assert public_id == newer.public_id
    end
  end

  describe "create" do
    test "queues workflow execution with write scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})

      conn =
        conn
        |> authorize(user, ["executions:write"])
        |> post(~p"/api/v1/workflows/#{workflow.id}/executions", input: %{variables: %{x: 10}})

      location = List.first(get_resp_header(conn, "location"))

      assert %{
               "data" => %{
                 "id" => public_id,
                 "workflow_id" => workflow_id,
                 "status" => "queued",
                 "input" => %{"trigger" => "api", "variables" => %{"x" => 10}}
               }
             } = json_response(conn, :accepted)

      assert location == "/api/v1/workflows/#{workflow.id}/executions/#{public_id}"
      assert workflow_id == workflow.id
      assert Executions.get_execution_by_flow_and_public_id(workflow.id, public_id)
    end
  end

  describe "show" do
    test "shows workflow execution with read scope", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      execution = execution_fixture(%{flow: workflow})

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(~p"/api/v1/workflows/#{workflow.id}/executions/#{execution.public_id}")

      assert %{"data" => %{"id" => public_id, "workflow_id" => workflow_id}} =
               json_response(conn, 200)

      assert public_id == execution.public_id
      assert workflow_id == workflow.id
    end

    test "returns not found for mismatched workflow", %{conn: conn} do
      user = user_fixture()
      workflow = flow_fixture(%{user: user})
      other_workflow = flow_fixture(%{user: user, name: "Other Flow"})
      execution = execution_fixture(%{flow: workflow})

      conn =
        conn
        |> authorize(user, ["executions:read"])
        |> get(~p"/api/v1/workflows/#{other_workflow.id}/executions/#{execution.public_id}")

      assert %{"error" => %{"code" => "not_found", "message" => "Not Found"}} =
               json_response(conn, 404)
    end
  end

  defp authorize(conn, user, scopes) do
    {:ok, %{token: token}} = ApiKeys.create_api_key(user, %{name: "test key", scopes: scopes})
    put_req_header(conn, "authorization", "Bearer #{token}")
  end
end
