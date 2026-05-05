defmodule FusionFlowWorker.FlowExecutionWorkerTest do
  use FusionFlow.DataCase, async: true

  alias FusionFlow.Executions
  alias FusionFlowWorker.FlowExecutionWorker

  import FusionFlow.FlowsFixtures

  describe "perform/1" do
    test "runs a queued execution and persists result and structured logs" do
      flow =
        flow_fixture(%{
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Variable",
              "label" => "Variable",
              "controls" => %{
                "var_name" => "answer",
                "var_value" => "42",
                "var_type" => "Integer"
              }
            },
            %{"id" => "3", "type" => "Output", "label" => "Output", "controls" => %{}}
          ],
          connections: [
            %{
              "source" => "1",
              "sourceOutput" => "exec",
              "target" => "2",
              "targetInput" => "exec"
            },
            %{"source" => "2", "sourceOutput" => "exec", "target" => "3", "targetInput" => "exec"}
          ]
        })

      execution = execution_fixture(%{flow: flow, input: %{"request_id" => "req-1"}})
      :ok = Executions.subscribe_to_execution(execution)

      assert :ok = perform_execution(execution)

      persisted_execution = Executions.get_execution!(execution.id)
      assert persisted_execution.status == "succeeded"
      assert persisted_execution.input == %{"request_id" => "req-1"}
      assert persisted_execution.result["variables"] == %{"answer" => 42}
      assert persisted_execution.result["request_id"] == "req-1"
      assert length(persisted_execution.logs) == 3
      assert %DateTime{} = persisted_execution.started_at
      assert %DateTime{} = persisted_execution.finished_at
      assert_receive {:execution_updated, %{id: execution_id, status: "succeeded"}}
      assert execution_id == execution.id
    end

    test "marks execution as failed when the runner cannot start" do
      flow = flow_fixture(%{nodes: [], connections: []})
      execution = execution_fixture(%{flow: flow})
      :ok = Executions.subscribe_to_execution(execution)

      assert :ok = perform_execution(execution)

      persisted_execution = Executions.get_execution!(execution.id)
      assert persisted_execution.status == "failed"
      assert persisted_execution.error == %{"message" => "No Start node found"}
      assert %DateTime{} = persisted_execution.started_at
      assert %DateTime{} = persisted_execution.finished_at
      assert_receive {:execution_updated, %{id: execution_id, status: "failed"}}
      assert execution_id == execution.id
    end

    test "runs a webhook execution and persists request context" do
      flow =
        flow_fixture(%{
          nodes: [
            %{
              "id" => "1",
              "type" => "Webhook",
              "label" => "Webhook",
              "controls" => %{"path" => "/webhook/orders", "method" => "POST"}
            },
            %{"id" => "2", "type" => "Output", "label" => "Output", "controls" => %{}}
          ],
          connections: [
            %{"source" => "1", "sourceOutput" => "exec", "target" => "2", "targetInput" => "exec"}
          ]
        })

      execution =
        execution_fixture(%{
          flow: flow,
          input: %{
            "trigger" => "webhook",
            "request" => %{
              "body" => %{"value" => 999},
              "headers" => %{"content-type" => "application/json"},
              "method" => "POST",
              "query_params" => %{"source" => "api"},
              "path" => "/flows/#{flow.id}/webhook/orders"
            }
          }
        })

      :ok = Executions.subscribe_to_execution(execution)

      assert :ok = perform_execution(execution)

      persisted_execution = Executions.get_execution!(execution.id)
      assert persisted_execution.status == "succeeded"
      assert persisted_execution.result["body"] == %{"value" => 999}
      assert persisted_execution.result["method"] == "POST"
      assert persisted_execution.result["query_params"] == %{"source" => "api"}
      assert persisted_execution.result["request_path"] == "/flows/#{flow.id}/webhook/orders"
      assert length(persisted_execution.logs) == 2
      assert_receive {:execution_updated, %{id: execution_id, status: "succeeded"}}
      assert execution_id == execution.id
    end
  end

  defp perform_execution(execution) do
    FlowExecutionWorker.perform(%Oban.Job{args: %{"execution_id" => execution.id}})
  end
end
