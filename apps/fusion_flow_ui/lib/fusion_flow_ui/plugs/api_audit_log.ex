defmodule FusionFlowUI.Plugs.ApiAuditLog do
  @moduledoc """
  Logs API usage by API key.
  """
  import Plug.Conn
  require Logger

  def init(opts), do: opts

  def call(conn, _opts) do
    register_before_send(conn, fn conn ->
      if api_key = conn.assigns[:api_key] do
        Logger.info("API Audit: key=#{api_key.prefix} method=#{conn.method} path=#{conn.request_path} status=#{conn.status}")
      end
      conn
    end)
  end
end
