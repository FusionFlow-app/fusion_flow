defmodule FusionFlow.MixProject do
  use Mix.Project

  @version File.read!(Path.expand("../../VERSION", __DIR__)) |> String.trim()

  def project do
    [
      app: :fusion_flow,
      version: @version,
      build_path: "../../_build",
      config_path: "../../config/config.exs",
      deps_path: "../../deps",
      lockfile: "../../mix.lock",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      package: package(),
      description: description(),
      docs: docs()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:ex_doc, "~> 0.31", runtime: false}
    ]
  end

  defp description do
    "Visual flow orchestrator leveraging BEAM for resilient and real-time automation."
  end

  defp package do
    [
      name: "fusion_flow",
      licenses: ["MIT"],
      links: %{"GitHub" => "https://github.com/hubs/fusion_flow"}
    ]
  end

  defp docs do
    [
      main: "FusionFlow",
      extras: ["guides/installation.md", "guides/scaling.md"]
    ]
  end
end
