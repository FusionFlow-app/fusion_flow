defmodule FusionFlow.ExecutionsTest do
  use FusionFlow.DataCase

  alias FusionFlow.Executions
  alias FusionFlow.Executions.Execution

  import FusionFlow.FlowsFixtures

  describe "executions" do
    test "create_execution/1 creates a queued execution with defaults" do
      flow = flow_fixture()

      assert {:ok, %Execution{} = execution} =
               Executions.create_execution(%{flow_id: flow.id, input: %{"trigger" => "manual"}})

      assert execution.flow_id == flow.id
      assert execution.public_id =~ ~r/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/
      assert execution.status == "queued"
      assert execution.input == %{"trigger" => "manual"}
      assert execution.result == nil
      assert execution.error == nil
      assert execution.logs == []
      assert execution.started_at == nil
      assert execution.finished_at == nil
    end

    test "get_execution_by_public_id!/1 returns an execution by readable id" do
      execution = execution_fixture()

      assert found_execution = Executions.get_execution_by_public_id!(execution.public_id)
      assert found_execution.id == execution.id
    end

    test "get_execution_by_flow_and_public_id/2 returns execution for flow and public id" do
      flow = flow_fixture()
      execution = execution_fixture(%{flow: flow})

      assert found_execution =
               Executions.get_execution_by_flow_and_public_id(flow.id, execution.public_id)

      assert found_execution.id == execution.id
    end

    test "get_execution_by_flow_and_public_id/2 returns nil for mismatched flow" do
      flow = flow_fixture()
      other_flow = flow_fixture(%{name: "Other Flow"})
      execution = execution_fixture(%{flow: flow})

      assert Executions.get_execution_by_flow_and_public_id(other_flow.id, execution.public_id) ==
               nil
    end

    test "create_execution/1 rejects unknown states" do
      flow = flow_fixture()

      assert {:error, changeset} =
               Executions.create_execution(%{flow_id: flow.id, status: "waiting"})

      assert %{status: ["is invalid"]} = errors_on(changeset)
    end

    test "create_execution/1 rejects duplicate public ids" do
      flow = flow_fixture()
      public_id = "blue-orbit-run"

      assert {:ok, _execution} =
               Executions.create_execution(%{flow_id: flow.id, public_id: public_id})

      assert {:error, changeset} =
               Executions.create_execution(%{flow_id: flow.id, public_id: public_id})

      assert %{public_id: ["has already been taken"]} = errors_on(changeset)
    end

    test "list_executions_for_flow/1 returns only executions for the given flow" do
      flow = flow_fixture()
      other_flow = flow_fixture(%{name: "Other Flow"})
      execution = execution_fixture(%{flow: flow})
      _other_execution = execution_fixture(%{flow: other_flow})

      assert [listed_execution] = Executions.list_executions_for_flow(flow)
      assert listed_execution.id == execution.id
    end

    test "mark_running/2 moves an execution into running state" do
      execution = execution_fixture()

      assert {:ok, running_execution} = Executions.mark_running(execution)

      assert running_execution.status == "running"
      assert %DateTime{} = running_execution.started_at
      assert running_execution.finished_at == nil
    end

    test "mark_succeeded/3 stores result and terminal timestamp" do
      execution =
        execution_fixture()
        |> then(fn execution ->
          {:ok, execution} = Executions.mark_running(execution)
          execution
        end)

      assert {:ok, succeeded_execution} =
               Executions.mark_succeeded(execution, %{"value" => 42}, %{
                 logs: [%{"node_id" => "output", "status" => "success"}]
               })

      assert succeeded_execution.status == "succeeded"
      assert succeeded_execution.result == %{"value" => 42}
      assert succeeded_execution.error == nil
      assert succeeded_execution.logs == [%{"node_id" => "output", "status" => "success"}]
      assert %DateTime{} = succeeded_execution.finished_at
    end

    test "mark_failed/3 stores normalized error and terminal timestamp" do
      execution = execution_fixture()

      assert {:ok, failed_execution} =
               Executions.mark_failed(execution, "No Start node found", %{
                 logs: [%{"node_id" => "start", "status" => "error"}]
               })

      assert failed_execution.status == "failed"
      assert failed_execution.error == %{"message" => "No Start node found"}
      assert failed_execution.logs == [%{"node_id" => "start", "status" => "error"}]
      assert %DateTime{} = failed_execution.finished_at
    end

    test "append_log/2 adds structured log entries" do
      execution = execution_fixture()

      assert {:ok, execution} =
               Executions.append_log(execution, %{"node_id" => "start", "status" => "success"})

      assert execution.logs == [%{"node_id" => "start", "status" => "success"}]
    end
  end
end
