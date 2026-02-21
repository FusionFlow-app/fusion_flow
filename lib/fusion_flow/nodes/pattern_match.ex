defmodule FusionFlow.Nodes.PatternMatch do
  def definition do
    %{
      name: "Pattern Match",
      category: :flow_control,
      icon: "hero-magnifying-glass",
      inputs: [:exec],
      outputs: ["match", "no_match"],
      show: false,
      ui_fields: [
        %{
          type: :text,
          name: :pattern,
          label: "Pattern",
          default: "{:ok, result}"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            text :pattern, label: "Pattern", default: "{:ok, result}"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    pattern_string = context["pattern"]

    {_pattern_ast, _} = Code.string_to_quoted(pattern_string)
    {:ok, :match}
  end
end
