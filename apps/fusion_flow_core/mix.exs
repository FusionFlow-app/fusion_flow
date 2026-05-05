defmodule FusionFlowCore.MixProject do
  use Mix.Project

  def project do
    [
      app: :fusion_flow_core,
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
      mod: {FusionFlowCore.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:pbkdf2_elixir, "~> 2.0"},
      {:ecto_sql, "~> 3.13"},
      {:postgrex, ">= 0.0.0"},
      {:jason, "~> 1.2"},
      {:oban, "~> 2.0"},
      {:req, "~> 0.5"},
      {:igniter, "~> 0.6", only: [:dev, :test]},
      {:phoenix_pubsub, "~> 2.1"}
    ]
  end
end
