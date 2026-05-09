defmodule FusionFlowWorker.MixProject do
  use Mix.Project

  def project do
    [
      app: :fusion_flow_worker,
      version: "0.1.0",
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.15",
      elixirc_paths: elixirc_paths(Mix.env()),
      test_coverage: [summary: [threshold: 0]],
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      mod: {FusionFlowWorker.Application, []},
      extra_applications: [:logger]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:fusion_flow_core, in_umbrella: true},
      {:fusion_flow_nodes, in_umbrella: true},
      {:fusion_flow_runtime, in_umbrella: true},
      {:oban, "~> 2.0"}
    ]
  end
end
