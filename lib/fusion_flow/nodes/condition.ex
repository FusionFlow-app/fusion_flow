defmodule FusionFlow.Nodes.Condition do
  use FusionKit.Node

  definition do
    %{
      name: "Condition",
      title: "Condition",
      category: :flow_control,
      color: "bg-yellow-100 text-yellow-600",
      description:
        "Routes execution through true or false outputs based on a variable comparison.",
      icon: "hero-arrows-right-left",
      inputs: [:exec],
      outputs: ["true", "false"],
      show: true,
      ui_fields: [
        %{
          type: "variable-select",
          name: :variable,
          label: "Variable",
          default: ""
        },
        %{
          type: :select,
          name: :operator,
          label: "Operator",
          options: [
            %{label: "equal", value: "=="},
            %{label: "not equal", value: "!="},
            %{label: "greater than", value: ">"},
            %{label: "less than", value: "<"},
            %{label: "contains", value: "contains"}
          ],
          default: "=="
        },
        %{
          type: :text,
          name: :value,
          label: "Value",
          default: ""
        }
      ]
    }
  end

  @impl true
  def handler(context, _input) do
    var_name = context["variable"]
    operator = context["operator"] || "=="
    compare_value = context["value"] || ""

    actual_value =
      context
      |> Map.get("variables", %{})
      |> Map.get(var_name, Map.get(context, var_name))

    result = evaluate_condition(actual_value, operator, compare_value)

    if result do
      {:ok, context, "true"}
    else
      {:ok, context, "false"}
    end
  end

  defp evaluate_condition(val, "==", target), do: to_string(val) == to_string(target)
  defp evaluate_condition(val, "!=", target), do: to_string(val) != to_string(target)
  defp evaluate_condition(val, ">", target), do: to_number(val) > to_number(target)
  defp evaluate_condition(val, "<", target), do: to_number(val) < to_number(target)

  defp evaluate_condition(val, "contains", target) do
    to_string(val) |> String.contains?(to_string(target))
  end

  defp evaluate_condition(_, _, _), do: false

  defp to_number(val) do
    case val do
      v when is_number(v) ->
        v

      v when is_binary(v) ->
        case Float.parse(v) do
          {num, _} -> num
          _ -> 0
        end

      _ ->
        0
    end
  end
end
