defmodule FusionFlowWeb.ExecutionControllerTest do
  use FusionFlowWeb.ConnCase, async: true

  import FusionFlow.FlowsFixtures

  describe "show execution" do
    test "returns execution status for flow and public id", %{conn: conn} do
      flow = flow_fixture()
      execution = execution_fixture(%{flow: flow})

      conn = get(conn, ~p"/api/flows/#{flow.id}/executions/#{execution.public_id}")

      assert %{
               "data" => %{
                 "id" => execution_id,
                 "flow_id" => flow_id,
                 "public_id" => public_id,
                 "status" => status,
                 "input" => input,
                 "result" => result,
                 "error" => error,
                 "logs" => logs,
                 "started_at" => started_at,
                 "finished_at" => finished_at,
                 "inserted_at" => inserted_at,
                 "updated_at" => updated_at
               }
             } = json_response(conn, 200)

      assert execution_id == execution.id
      assert flow_id == flow.id
      assert public_id == execution.public_id
      assert status == execution.status
      assert input == execution.input
      assert result == execution.result
      assert error == execution.error
      assert logs == execution.logs
      assert started_at == iso8601_or_nil(execution.started_at)
      assert finished_at == iso8601_or_nil(execution.finished_at)
      assert inserted_at == DateTime.to_iso8601(execution.inserted_at)
      assert updated_at == DateTime.to_iso8601(execution.updated_at)
    end

    test "returns not found for mismatched flow", %{conn: conn} do
      flow = flow_fixture()
      other_flow = flow_fixture(%{name: "Other Flow"})
      execution = execution_fixture(%{flow: flow})

      conn = get(conn, ~p"/api/flows/#{other_flow.id}/executions/#{execution.public_id}")

      assert json_response(conn, 404)
    end
  end

  defp iso8601_or_nil(nil), do: nil
  defp iso8601_or_nil(%DateTime{} = datetime), do: DateTime.to_iso8601(datetime)
end
