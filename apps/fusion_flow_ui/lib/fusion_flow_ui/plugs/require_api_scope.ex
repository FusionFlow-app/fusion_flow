defmodule FusionFlowUI.Plugs.RequireApiScope do
  @moduledoc """
  Ensures an authenticated API key has the scopes required by the action.
  """

  import Plug.Conn

  alias FusionFlowCore.ApiKeys.ApiKey
  alias FusionFlowUI.ApiError

  def init(opts), do: List.wrap(opts)

  def call(%Plug.Conn{assigns: %{api_key: %ApiKey{} = api_key}} = conn, required_scopes) do
    if ApiKey.allows?(api_key, required_scopes) do
      conn
    else
      forbidden(conn)
    end
  end

  def call(conn, _required_scopes), do: unauthorized(conn)

  defp unauthorized(conn) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(:unauthorized, Jason.encode!(ApiError.format(:unauthorized, "Unauthorized")))
    |> halt()
  end

  defp forbidden(conn) do
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(:forbidden, Jason.encode!(ApiError.format(:forbidden, "Forbidden")))
    |> halt()
  end
end
