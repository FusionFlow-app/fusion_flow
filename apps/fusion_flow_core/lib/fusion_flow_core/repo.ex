defmodule FusionFlowCore.Repo do
  use Ecto.Repo,
    otp_app: :fusion_flow_core,
    adapter: Ecto.Adapters.Postgres
end
