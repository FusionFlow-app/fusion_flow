defmodule FusionFlow.Nodes.Variable do
  def definition do
    %{
      name: "Variable",
      category: :data_manipulation,
      icon: "hero-variable",
      inputs: [:exec],
      outputs: ["exec"],
      show: true,
      ui_fields: [
        %{
          type: :text,
          name: :var_name,
          label: "Variable Name",
          default: "my_var"
        },
        %{
          type: :text,
          name: :var_value,
          label: "Value",
          default: ""
        },
        %{
          type: :select,
          name: :var_type,
          label: "Type",
          options: ["String", "Integer", "JSON"],
          default: "String"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            text :var_name, label: "Variable Name", default: "my_var"
            text :var_value, label: "Value", default: ""
            select :var_type, label: "Type", options: ["String", "Integer", "JSON"], default: "String"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    var_name = context["var_name"]
    var_value = context["var_value"]
    var_type = context["var_type"] || "String"

    parsed_value =
      case var_type do
        "Integer" ->
          case Integer.parse(var_value) do
            {int, _} -> int
            :error -> var_value
          end

        "JSON" ->
          case Jason.decode(var_value) do
            {:ok, json} -> json
            {:error, _} -> var_value
          end

        _ ->
          var_value
      end

    if var_name && var_name != "" do
      {:ok, Map.put(context, var_name, parsed_value)}
    else
      {:ok, context}
    end
  end
end
