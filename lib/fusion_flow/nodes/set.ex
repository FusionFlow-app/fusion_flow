defmodule FusionFlow.Nodes.Set do
  def definition do
    %{
      name: "Set",
      category: :data_manipulation,
      icon: "hero-adjustments-horizontal",
      inputs: [:exec],
      outputs: ["exec"],
      show: false,
      ui_fields: [
        %{
          type: :json,
          name: :fields,
          label: "Fields (Key, Value)",
          default: "[{\"key\": \"new_var\", \"value\": \"some_value\", \"type\": \"string\"}]"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            list :fields, keys: [:key, :value, :type]
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    fields = Jason.decode!(context["fields"] || "[]")

    new_context =
      Enum.reduce(fields, context, fn %{"key" => k, "value" => v}, acc ->
        Map.put(acc, k, v)
      end)

    {:ok, new_context}
  end
end
