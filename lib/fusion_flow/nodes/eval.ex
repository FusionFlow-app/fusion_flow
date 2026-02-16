defmodule FusionFlow.Nodes.Eval do
  @moduledoc """
  Evaluate Code node definition.
  """

  def definition do
    %{
      name: "Evaluate Code",
      category: :code,
      icon: "</>",
      inputs: [:exec],
      outputs: [:exec],
      ui_fields: [
        %{
          type: :code,
          name: :code,
          label: "Code Editor",
          render: "button",
          language: "elixir",
          default: """
          result =
            input
            |> Enum.map(& &1 * 2)
            |> Enum.filter(&(&1 > 10))

          {:ok, result}
          """
        }
      ]
    }
  end

  def handler(context, input) do
    code = context["code"] || ""

    {result, _} = Code.eval_string(code, input: input, context: context)

    result
  end
end
