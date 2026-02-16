defmodule FusionFlow.Nodes.Condition do
  def definition do
    %{
      name: "Condition",
      category: :flow_control,
      icon: "⑂",
      inputs: [:exec],
      outputs: ["true", "false"],
      ui_fields: [
        %{
          type: :text,
          name: :expression,
          label: "Condition",
          default: "true"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic (Elixir)",
          language: "elixir",
          default: """
          ui do
            text :expression, label: "Condition", default: "true"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    {result, _} = Code.eval_string(context["expression"] || "false")

    if result do
      {:ok, true}
    else
      {:ok, false}
    end
  end
end
