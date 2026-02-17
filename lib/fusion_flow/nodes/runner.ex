defmodule FusionFlow.Nodes.Runner do
  alias FusionFlow.Nodes.Registry

  def run(flow) do
    start_node =
      Enum.find(flow.nodes, fn node -> node["type"] == "Start" || node["label"] == "Start" end)

    if start_node do
      initial_context = %{
        "flow_id" => flow.id,
        "logs" => []
      }

      case execute_node(start_node, initial_context, flow) do
        {:ok, execution_result} -> {:ok, execution_result}
        {:error, reason, node_id} -> {:error, reason, node_id}
      end
    else
      {:error, "No Start node found", nil}
    end
  end

  defp execute_node(node, context, flow) do
    node_type = node["type"] || node["label"]
    definition = Registry.get_node(node_type)

    if definition do
      module = get_node_module(node_type)
      node_context = Map.merge(context, node["controls"] || %{})

      try do
        case apply(module, :handler, [node_context, nil]) do
          {:ok, new_context} ->
            connections = Enum.filter(flow.connections, fn c -> c["source"] == node["id"] end)

            Enum.reduce_while(connections, {:ok, new_context}, fn conn, {:ok, acc_context} ->
              target_node = Enum.find(flow.nodes, fn n -> n["id"] == conn["target"] end)

              if target_node do
                case execute_node(target_node, acc_context, flow) do
                  {:ok, next_ctx} -> {:cont, {:ok, next_ctx}}
                  {:error, r, n} -> {:halt, {:error, r, n}}
                end
              else
                {:cont, {:ok, acc_context}}
              end
            end)

          {:error, reason} ->
            {:error, reason, to_string(node["id"])}
        end
      rescue
        e ->
          {:error, Exception.message(e), to_string(node["id"])}
      catch
        kind, reason ->
          formatted_reason = Exception.format(kind, reason, __STACKTRACE__)
          {:error, formatted_reason, to_string(node["id"])}
      end
    else
      {:ok, context}
    end
  end

  defp get_node_module("Start"), do: FusionFlow.Nodes.Start
  defp get_node_module("Variable"), do: FusionFlow.Nodes.Variable
  defp get_node_module("Output"), do: FusionFlow.Nodes.Output
  defp get_node_module("Evaluate Code"), do: FusionFlow.Nodes.Eval

  defp get_node_module(name) do
    module_name = "Elixir.FusionFlow.Nodes.#{String.replace(name, " ", "")}"

    try do
      String.to_existing_atom(module_name)
    rescue
      _ -> nil
    end
  end
end
