defmodule FusionFlowRuntime.Runtime do
  @moduledoc """
  Registry and dispatcher for language runtimes.

  To add a new runtime: implement `FusionFlowRuntime.Runtime.Executor` and add the
  module to `@runtimes`.
  """

  @runtimes [
    FusionFlowRuntime.Runtime.Elixir,
    FusionFlowRuntime.Runtime.Python
  ]

  def runtimes, do: @runtimes

  def languages, do: Enum.map(@runtimes, & &1.language())

  def default_language, do: hd(languages())

  def code_field(language), do: "code_#{language}"

  def execute(language, code, context) do
    case Enum.find(@runtimes, &(&1.language() == language)) do
      nil -> {:error, "Unsupported language: #{language}"}
      runtime -> runtime.execute(code, context)
    end
  end
end
