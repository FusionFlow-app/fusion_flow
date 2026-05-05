defmodule FusionFlowWeb.Plugs.WebhookPlug do
  @moduledoc """
  Plug that intercepts incoming HTTP requests matching `/flows/:id/webhook/*` paths
  and routes them to the appropriate flow execution.
  """

  import Plug.Conn

  def init(opts), do: opts

  def call(%Plug.Conn{path_info: ["flows", flow_id, "webhook" | rest]} = conn, _opts)
      when rest != [] do
    slug = Enum.join(rest, "/")

    case FusionFlow.Webhooks.get_by_flow_and_slug(flow_id, slug) do
      {:ok, %{method: expected_method}} ->
        if String.upcase(conn.method) == String.upcase(expected_method) do
          execute_webhook(conn, flow_id)
        else
          conn
          |> put_resp_content_type("application/json")
          |> send_resp(
            405,
            Jason.encode!(%{error: "Method not allowed. Expected #{expected_method}"})
          )
          |> halt()
        end

      :error ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(404, Jason.encode!(%{error: "Webhook not found"}))
        |> halt()
    end
  end

  def call(conn, _opts), do: conn

  defp execute_webhook(conn, flow_id) do
    flow =
      case FusionFlow.Flows.Cache.get(flow_id) do
        nil ->
          flow = FusionFlow.Flows.get_flow!(flow_id)
          FusionFlow.Flows.Cache.put(flow)
          flow

        cached ->
          cached
      end

    with {:ok, execution} <- create_webhook_execution(flow, conn),
         {:ok, _job} <- FusionFlow.Executions.enqueue_execution(execution) do
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(
        202,
        Jason.encode!(%{
          status: "accepted",
          execution_id: execution.public_id,
          execution_status: execution.status
        })
      )
      |> halt()
    else
      {:error, _reason} ->
        conn
        |> put_resp_content_type("application/json")
        |> send_resp(500, Jason.encode!(%{error: "Execution could not be queued"}))
        |> halt()
    end
  rescue
    Ecto.NoResultsError ->
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(404, Jason.encode!(%{error: "Flow not found"}))
      |> halt()
  end

  defp create_webhook_execution(flow, conn) do
    FusionFlow.Executions.create_execution(%{
      flow_id: flow.id,
      input: %{
        "trigger" => "webhook",
        "request" => %{
          "body" => conn.body_params,
          "headers" => Enum.into(conn.req_headers, %{}),
          "method" => conn.method,
          "query_params" => conn.query_params,
          "path" => conn.request_path
        }
      }
    })
  end
end
