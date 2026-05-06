# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :fusion_flow_ui, :scopes,
  user: [
    default: true,
    module: FusionFlowCore.Accounts.Scope,
    assign_key: :current_scope,
    access_path: [:user, :id],
    schema_key: :user_id,
    schema_type: :id,
    schema_table: :users,
    test_data_fixture: FusionFlowCore.AccountsFixtures,
    test_setup_helper: :register_and_log_in_user
  ]

config :fusion_flow_worker, Oban,
  engine: Oban.Engines.Basic,
  notifier: Oban.Notifiers.Postgres,
  queues: [default: 2, executions: 5],
  repo: FusionFlowCore.Repo

config :fusion_flow_core, Oban,
  engine: Oban.Engines.Basic,
  name: FusionFlowCore.Oban,
  notifier: Oban.Notifiers.Postgres,
  queues: [],
  repo: FusionFlowCore.Repo

config :fusion_flow_core, :oban_name, FusionFlowCore.Oban

config :fusion_flow_core,
  ecto_repos: [FusionFlowCore.Repo],
  generators: [timestamp_type: :utc_datetime]

# Configure the endpoint
config :fusion_flow_ui, FusionFlowUI.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: FusionFlowUI.ErrorHTML, json: FusionFlowUI.ErrorJSON],
    layout: false
  ],
  pubsub_server: FusionFlowCore.PubSub,
  live_view: [signing_salt: "41Etxq0i"]

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.25.4",
  fusion_flow_ui: [
    args:
      ~w(js/app.js --bundle --target=es2022 --outdir=../priv/static/assets/js --external:/fonts/* --external:/images/* --alias:@=.),
    cd: Path.expand("../apps/fusion_flow_ui/assets", __DIR__),
    env: %{"NODE_PATH" => [Path.expand("../deps", __DIR__), Mix.Project.build_path()]}
  ]

# Configure tailwind (the version is required)
config :tailwind,
  version: "4.1.12",
  fusion_flow_ui: [
    args: ~w(
      --input=css/app.css
      --output=../priv/static/assets/css/app.css
    ),
    cd: Path.expand("../apps/fusion_flow_ui/assets", __DIR__)
  ]

# Configure Elixir's Logger
config :logger, :default_formatter,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
