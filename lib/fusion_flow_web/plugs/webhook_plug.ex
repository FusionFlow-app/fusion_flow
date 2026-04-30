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

    webhook_request = %{
      "body" => conn.body_params,
      "headers" => Enum.into(conn.req_headers, %{}),
      "method" => conn.method,
      "query_params" => conn.query_params,
      "path" => conn.request_path
    }

    result =
      case FusionFlow.Flows.Runner.run_from_webhook(flow, webhook_request) do
        {:ok, execution_result} -> %{status: "ok", result: sanitize(execution_result)}
        {:error, reason, _node_id} -> %{status: "error", error: sanitize(reason)}
      end

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(200, Jason.encode!(result))
    |> halt()
  rescue
    Ecto.NoResultsError ->
      conn
      |> put_resp_content_type("application/json")
      |> send_resp(404, Jason.encode!(%{error: "Flow not found"}))
      |> halt()
  end

  defp sanitize(value) when is_map(value) do
    value
    |> Map.drop(["logs"])
    |> Map.new(fn {k, v} -> {to_string(k), sanitize(v)} end)
  end

  defp sanitize(value) when is_list(value), do: Enum.map(value, &sanitize/1)
  defp sanitize(value) when is_atom(value), do: to_string(value)
  defp sanitize(value), do: value
end
