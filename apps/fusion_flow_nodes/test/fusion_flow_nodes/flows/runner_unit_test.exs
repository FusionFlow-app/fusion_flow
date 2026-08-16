defmodule FusionFlowNodes.RunnerUnitTest do
  use ExUnit.Case, async: true

  alias FusionFlowNodes.Runner

  defp flow(nodes, connections \\ []) do
    %{nodes: nodes, connections: connections, id: "test-flow-id"}
  end

  defp node(id, type, controls \\ %{}) do
    %{"id" => id, "type" => type, "label" => type, "controls" => controls, "position" => %{}}
  end

  defp connection(source, source_output, target) do
    %{
      "source" => source,
      "sourceOutput" => source_output,
      "target" => target,
      "targetInput" => "exec"
    }
  end

  describe "run/2 — start node handling" do
    test "returns error when no Start node exists in the flow" do
      f =
        flow([
          node("1", "Variable", %{"var_name" => "x", "var_value" => "1", "var_type" => "String"})
        ])

      assert {:error, "No Start node found", nil} = Runner.run(f)
    end

    test "succeeds with a flow containing only a Start node" do
      f = flow([node("1", "Start")])

      assert {:ok, context} = Runner.run(f)
      assert context["flow_id"] == "test-flow-id"
      assert length(context["logs"]) == 1
    end

    test "normalizes non-map input to empty map" do
      f = flow([node("1", "Start")])

      assert {:ok, context} = Runner.run(f, "not a map")
      refute Map.has_key?(context, "0")
    end

    test "normalizes map input keys to strings" do
      f = flow([node("1", "Start")])

      assert {:ok, context} = Runner.run(f, %{payload: "hello"})
      assert context["payload"] == "hello"
    end
  end

  describe "run/2 — node execution" do
    test "executes a Start → Variable → Output chain" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "count",
              "var_value" => "7",
              "var_type" => "Integer"
            }),
            node("3", "Output", %{"status" => "success"})
          ],
          [
            connection("1", "exec", "2"),
            connection("2", "exec", "3")
          ]
        )

      assert {:ok, context} = Runner.run(f)
      assert context["variables"]["count"] == 7
      assert context["status"] == "success"
      assert length(context["logs"]) == 3
    end

    test "skips nodes whose type is not registered" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "UnknownNodeType")
          ],
          [connection("1", "exec", "2")]
        )

      assert {:ok, context} = Runner.run(f)
      assert context["flow_id"] == "test-flow-id"
    end

    test "returns error when node raises an exception" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Evaluate Code", %{
              "language" => "elixir",
              "code_elixir" => "raise \"boom\""
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:error, _reason, "2"} = Runner.run(f)
    end

    test "removes node control keys from context after execution" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "x",
              "var_value" => "10",
              "var_type" => "Integer"
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:ok, context} = Runner.run(f)
      refute Map.has_key?(context, "var_name")
      refute Map.has_key?(context, "var_value")
      refute Map.has_key?(context, "var_type")
    end

    test "routes Condition node to true branch" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "score",
              "var_value" => "100",
              "var_type" => "Integer"
            }),
            node("3", "Condition", %{"variable" => "score", "operator" => ">", "value" => "50"}),
            node("4", "Output", %{"status" => "passed"})
          ],
          [
            connection("1", "exec", "2"),
            connection("2", "exec", "3"),
            connection("3", "true", "4")
          ]
        )

      assert {:ok, context} = Runner.run(f)
      assert context["status"] == "passed"
    end

    test "routes Condition node to false branch" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "score",
              "var_value" => "10",
              "var_type" => "Integer"
            }),
            node("3", "Condition", %{"variable" => "score", "operator" => ">", "value" => "50"}),
            node("4", "Output", %{"status" => "failed"})
          ],
          [
            connection("1", "exec", "2"),
            connection("2", "exec", "3"),
            connection("3", "false", "4")
          ]
        )

      assert {:ok, context} = Runner.run(f)
      assert context["status"] == "failed"
    end

    test "execution log records node_type and status for each node" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "x",
              "var_value" => "1",
              "var_type" => "Integer"
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:ok, context} = Runner.run(f)

      assert Enum.map(context["logs"], & &1["node_type"]) == ["Start", "Variable"]
      assert Enum.all?(context["logs"], fn log -> log["status"] == "success" end)
    end

    test "execution log records error status and error message on failure" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Evaluate Code", %{
              "language" => "elixir",
              "code_elixir" => "raise \"failure\""
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:error, _reason, _id} = Runner.run(f)
    end

    test "connection with missing target node is skipped gracefully" do
      f =
        flow(
          [node("1", "Start")],
          [connection("1", "exec", "nonexistent")]
        )

      assert {:ok, _context} = Runner.run(f)
    end

    test "restores control keys that were present in the original context" do
      f =
        flow(
          [
            node("1", "Start"),
            node("2", "Variable", %{
              "var_name" => "x",
              "var_value" => "10",
              "var_type" => "Integer"
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:ok, context} = Runner.run(f, %{"var_name" => "original"})
      assert context["var_name"] == "original"
    end
  end

  describe "run/2 — HTTP Request node" do
    test "executes an HTTP Request node and routes success response" do
      Req.Test.stub(FusionFlowNodes.Nodes.HttpRequest, fn conn ->
        Req.Test.json(conn, %{"data" => "ok"})
      end)

      f =
        flow(
          [
            node("1", "Start"),
            node("2", "HTTP Request", %{
              "method" => "GET",
              "url" => "https://api.test.com/ping",
              "headers" => "{}"
            }),
            node("3", "Output", %{"status" => "done"})
          ],
          [
            connection("1", "exec", "2"),
            connection("2", "success", "3")
          ]
        )

      assert {:ok, context} = Runner.run(f)
      assert context["status"] == "done"
      assert context["result"] == %{"data" => "ok"}
    end

    test "catches exceptions raised by a node handler" do
      Req.Test.stub(FusionFlowNodes.Nodes.HttpRequest, fn _conn ->
        raise Req.TransportError, reason: :econnrefused
      end)

      f =
        flow(
          [
            node("1", "Start"),
            node("2", "HTTP Request", %{
              "method" => "GET",
              "url" => "https://unreachable.test.com",
              "headers" => "{}"
            })
          ],
          [connection("1", "exec", "2")]
        )

      assert {:error, _reason, "2"} = Runner.run(f)
    end
  end

  describe "run_from_webhook/2" do
    test "returns error when flow has no Webhook node" do
      f = flow([node("1", "Start")])

      assert {:error, "No Webhook node found in flow", nil} =
               Runner.run_from_webhook(f, %{})
    end

    test "executes flow starting from the Webhook node" do
      f =
        flow(
          [
            node("1", "Webhook", %{"method" => "POST", "path" => "/hook"}),
            node("2", "Output", %{"status" => "success"})
          ],
          [connection("1", "exec", "2")]
        )

      webhook_request = %{
        "body" => %{"key" => "value"},
        "headers" => %{"content-type" => "application/json"},
        "method" => "POST",
        "query_params" => %{},
        "path" => "/hook"
      }

      assert {:ok, context} = Runner.run_from_webhook(f, webhook_request)
      assert context["flow_id"] == "test-flow-id"
      assert context["status"] == "success"
    end

    test "exposes webhook request fields in context" do
      f =
        flow(
          [node("1", "Webhook", %{"method" => "POST", "path" => "/hook"})],
          []
        )

      webhook_request = %{
        "body" => %{"order_id" => 42},
        "headers" => %{"x-token" => "abc"},
        "method" => "POST",
        "query_params" => %{"page" => "1"},
        "path" => "/hook"
      }

      assert {:ok, context} = Runner.run_from_webhook(f, webhook_request)
      assert context["body"] == %{"order_id" => 42}
      assert context["headers"] == %{"x-token" => "abc"}
      assert context["method"] == "POST"
      assert context["query_params"] == %{"page" => "1"}
      assert context["request_path"] == "/hook"
    end
  end
end
