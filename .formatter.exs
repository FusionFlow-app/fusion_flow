[
  import_deps: [:oban, :ecto, :ecto_sql, :phoenix],
  subdirectories: ["apps/*/priv/*/migrations"],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: [
    "*.{heex,ex,exs}",
    "{config,test}/**/*.{heex,ex,exs}",
    "apps/*/{lib,test}/**/*.{heex,ex,exs}",
    "apps/*/priv/*/seeds.exs"
  ]
]
