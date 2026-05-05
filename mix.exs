defmodule FusionFlow.Umbrella.MixProject do
  use Mix.Project

  def project do
    [
      apps_path: "apps",
      version: "0.1.0",
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      releases: releases(),
      listeners: [Phoenix.CodeReloader]
    ]
  end

  def cli do
    [
      preferred_envs: [precommit: :test]
    ]
  end

  defp deps do
    []
  end

  defp releases do
    [
      fusion_flow_ui: [
        applications: [
          fusion_flow_core: :permanent,
          fusion_flow_runtime: :permanent,
          fusion_flow_nodes: :permanent,
          fusion_flow_ai: :permanent,
          fusion_flow_ui: :permanent
        ]
      ],
      fusion_flow_worker: [
        applications: [
          fusion_flow_core: :permanent,
          fusion_flow_runtime: :permanent,
          fusion_flow_nodes: :permanent,
          fusion_flow_ai: :permanent,
          fusion_flow_worker: :permanent
        ]
      ]
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": [
        "ecto.create",
        "ecto.migrate",
        "run apps/fusion_flow_core/priv/repo/seeds.exs"
      ],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing"],
      "assets.build": ["compile", "tailwind fusion_flow_ui", "esbuild fusion_flow_ui"],
      "assets.deploy": [
        "tailwind fusion_flow_ui --minify",
        "esbuild fusion_flow_ui --minify",
        "phx.digest -o apps/fusion_flow_ui/priv/static"
      ],
      precommit: ["compile --warnings-as-errors", "deps.unlock --unused", "format", "test"]
    ]
  end
end
