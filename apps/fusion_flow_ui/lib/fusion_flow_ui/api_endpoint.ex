defmodule FusionFlowUI.ApiEndpoint do
  use Phoenix.Endpoint, otp_app: :fusion_flow_ui

  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :fusion_flow_core
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  plug FusionFlowUI.Plugs.WebhookPlug

  plug Plug.MethodOverride
  plug Plug.Head
  plug FusionFlowUI.ApiRouter
end
