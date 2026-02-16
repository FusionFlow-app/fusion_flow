defmodule FusionFlow.Repo do
  use Ecto.Repo,
    otp_app: :fusion_flow,
    adapter: Ecto.Adapters.Postgres
end
