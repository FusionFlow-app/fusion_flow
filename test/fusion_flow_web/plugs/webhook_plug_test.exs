defmodule FusionFlowWeb.Plugs.WebhookPlugTest do
  use FusionFlowWeb.ConnCase, async: true
  use Oban.Testing, repo: FusionFlow.Repo

  import FusionFlow.FlowsFixtures

  alias FusionFlow.Executions
  alias FusionFlow.Webhooks
  alias FusionFlowWorker.FlowExecutionWorker

  describe "call/2" do
    test "creates an execution, enqueues the worker, and returns accepted", %{conn: conn} do
      path = unique_webhook_path()
      slug = Webhooks.normalize_path(path)
      flow = webhook_flow_fixture(path: path, method: "POST")

      :ok = Webhooks.register_flow(flow)

      conn =
        post(conn, "/flows/#{flow.id}/webhook/#{slug}?source=api", %{
          "value" => 999
        })

      assert %{
               "status" => "accepted",
               "execution_id" => public_id,
               "execution_status" => "queued"
             } = json_response(conn, 202)

      assert [execution] = Executions.list_executions_for_flow(flow)
      assert public_id == execution.public_id
      assert execution.status == "queued"
      assert execution.input["trigger"] == "webhook"
      assert get_in(execution.input, ["request", "body"]) == %{"value" => 999}
      assert get_in(execution.input, ["request", "method"]) == "POST"
      assert get_in(execution.input, ["request", "query_params"]) == %{"source" => "api"}
      assert get_in(execution.input, ["request", "path"]) == "/flows/#{flow.id}/webhook/#{slug}"

      assert_enqueued(
        worker: FlowExecutionWorker,
        queue: :executions,
        args: %{execution_id: execution.id}
      )
    end

    test "rejects requests with the wrong method", %{conn: conn} do
      path = unique_webhook_path()
      slug = Webhooks.normalize_path(path)
      flow = webhook_flow_fixture(path: path, method: "POST")

      :ok = Webhooks.register_flow(flow)

      conn = get(conn, "/flows/#{flow.id}/webhook/#{slug}")

      assert %{"error" => "Method not allowed. Expected POST"} = json_response(conn, 405)
      assert [] = Executions.list_executions_for_flow(flow)
    end

    test "returns not found for unknown webhooks", %{conn: conn} do
      flow = flow_fixture()

      conn = post(conn, "/flows/#{flow.id}/webhook/missing", %{})

      assert %{"error" => "Webhook not found"} = json_response(conn, 404)
    end
  end

  defp webhook_flow_fixture(opts) do
    path = Keyword.fetch!(opts, :path)
    method = Keyword.fetch!(opts, :method)

    flow_fixture(%{
      nodes: [
        %{
          "id" => "1",
          "type" => "Webhook",
          "label" => "Webhook",
          "controls" => %{"path" => path, "method" => method}
        },
        %{"id" => "2", "type" => "Output", "label" => "Output", "controls" => %{}}
      ],
      connections: [
        %{"source" => "1", "sourceOutput" => "exec", "target" => "2", "targetInput" => "exec"}
      ]
    })
  end

  defp unique_webhook_path do
    "/webhook/test-#{System.unique_integer([:positive])}"
  end
end
