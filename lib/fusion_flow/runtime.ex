defmodule FusionFlow.Runtime do
  @moduledoc """
  Registry and dispatcher for language runtimes.

  To add a new runtime: implement `FusionFlow.Runtime.Executor` and add the
  module to `@runtimes`.
  """

  @runtimes [
    FusionFlow.Runtime.Elixir,
    FusionFlow.Runtime.Python
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
