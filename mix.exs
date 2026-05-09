defmodule FusionFlow.Umbrella.MixProject do
  use Mix.Project

  @version "0.2.0"

  def project do
    [
      apps_path: "apps",
      name: "FusionFlow",
      version: @version,
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      releases: releases(),
      listeners: [Phoenix.CodeReloader],
      docs: docs()
    ]
  end

  def version, do: @version

  defp docs do
    [
      source_ref: "v#{@version}",
      source_url: "https://github.com/FusionFlow-app/fusion_flow",
      extras: extras(),
      groups_for_extras: groups_for_extras()
    ]
  end

  defp extras do
    [
      "CONTRIBUTING.md",
      "guides/installation.md",
      "guides/scaling.md"
    ]
  end

  defp groups_for_extras do
    [
      "Guides": [
        "guides/installation.md",
        "guides/scaling.md"
      ]
    ]
  end

  def cli do
    [
      preferred_envs: [precommit: :test]
    ]
  end

  defp deps do
    [
      {:ex_doc, "~> 0.40.1", runtime: false}
    ]
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
      "assets.setup": [
        &install_ui_assets/1,
        "tailwind.install --if-missing",
        "esbuild.install --if-missing"
      ],
      "assets.build": ["compile", "tailwind fusion_flow_ui", "esbuild fusion_flow_ui"],
      "assets.deploy": [
        "tailwind fusion_flow_ui --minify",
        "esbuild fusion_flow_ui --minify",
        "phx.digest -o apps/fusion_flow_ui/priv/static"
      ],
      precommit: ["compile --warnings-as-errors", "deps.unlock --unused", "format", "test"]
    ]
  end

  defp install_ui_assets(_args) do
    assets_path = Path.expand("apps/fusion_flow_ui/assets", File.cwd!())

    cond do
      executable = System.find_executable("npm") ->
        run_installer(executable, ["install"], assets_path, "npm")

      executable = System.find_executable("bun") ->
        run_installer(executable, ["install"], assets_path, "bun")

      true ->
        Mix.raise("""
        Could not install UI asset dependencies.

        Neither `npm` nor `bun` was found in PATH.
        Install one of them and run `mix setup` again.
        """)
    end
  end

  defp run_installer(executable, args, assets_path, label) do
    Mix.shell().info("Installing UI asset dependencies with #{label} in #{assets_path}")

    case System.cmd(executable, args,
           cd: assets_path,
           into: IO.stream(:stdio, :line),
           stderr_to_stdout: true
         ) do
      {_output, 0} ->
        :ok

      {_output, status} ->
        Mix.raise("#{label} install failed in #{assets_path} with exit status #{status}")
    end
  end
end
