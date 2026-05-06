defmodule FusionFlowNodes.Nodes.Variable do
  use FusionKit.Node

  definition do
    %{
      name: "Variable",
      title: "Variable",
      category: :data_manipulation,
      color: "bg-blue-100 text-blue-600",
      description: "Stores a typed value in the flow context for later nodes.",
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
        }
      ]
    }
  end

  @impl true
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

    new_context =
      if var_name && var_name != "" do
        variables =
          context
          |> Map.get("variables", %{})
          |> Map.put(var_name, parsed_value)

        Map.put(context, "variables", variables)
      else
        context
      end

    {:ok, new_context, "exec"}
  end
end
