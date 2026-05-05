defmodule FusionFlowNodes.Runner do
  alias FusionFlowNodes.Nodes

  @internal_keys ["flow_id", "logs"]

  def run(flow, input \\ %{}) do
    start_node =
      Enum.find(flow.nodes, fn node -> node["type"] == "Start" || node["label"] == "Start" end)

    if start_node do
      initial_context =
        input
        |> normalize_input()
        |> Map.merge(%{
          "flow_id" => flow.id,
          "logs" => []
        })

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
    definition = Nodes.get_node(node_type)

    if definition do
      module = get_node_module(node_type)

      context = if is_map(context), do: context, else: %{"result" => context}
      control_keys = Map.keys(node["controls"] || %{}) -- preserved_control_keys(node_type)
      node_context = Map.merge(context, node["controls"] || %{})

      try do
        case apply(module, :handler, [node_context, nil]) do
          {:ok, result, output_name} ->
            result =
              finish_node(result, context, control_keys, node, node_type, output_name, :success)

            connections =
              flow.connections
              |> Enum.filter(fn c ->
                c["source"] == node["id"] && c["sourceOutput"] == to_string(output_name)
              end)

            process_connections(connections, result, flow)

          {:ok, result} ->
            output_name = List.first(definition[:outputs]) || "exec"

            result =
              finish_node(result, context, control_keys, node, node_type, output_name, :success)

            connections =
              flow.connections
              |> Enum.filter(fn c ->
                c["source"] == node["id"] && c["sourceOutput"] == to_string(output_name)
              end)

            process_connections(connections, result, flow)

          {:result, value} ->
            output_name = List.first(definition[:outputs]) || "exec"
            new_context = Map.put(context, "result", value)

            new_context =
              finish_node(
                new_context,
                context,
                control_keys,
                node,
                node_type,
                output_name,
                :success
              )

            connections =
              flow.connections
              |> Enum.filter(fn c ->
                c["source"] == node["id"] && c["sourceOutput"] == to_string(output_name)
              end)

            process_connections(connections, new_context, flow)

          {:error, reason} ->
            error_context =
              finish_node(
                Map.put(context, "result", reason),
                context,
                control_keys,
                node,
                node_type,
                "error",
                :error,
                format_reason(reason)
              )

            if "error" in (definition[:outputs] || []) do
              connections =
                flow.connections
                |> Enum.filter(fn c ->
                  c["source"] == node["id"] && c["sourceOutput"] == "error"
                end)

              process_connections(connections, error_context, flow)
            else
              {:error, reason, to_string(node["id"])}
            end
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

  defp finish_node(result, previous_context, control_keys, node, node_type, output_name, status) do
    finish_node(result, previous_context, control_keys, node, node_type, output_name, status, nil)
  end

  defp finish_node(
         result,
         previous_context,
         control_keys,
         node,
         node_type,
         output_name,
         status,
         error
       ) do
    result
    |> normalize_context()
    |> remove_node_controls(previous_context, control_keys)
    |> append_execution_log(node, node_type, output_name, status, error)
  end

  defp normalize_context(%{} = context), do: context
  defp normalize_context(value), do: %{"result" => value}

  defp remove_node_controls(context, previous_context, control_keys) do
    Enum.reduce(control_keys, context, fn key, acc ->
      if Map.has_key?(previous_context, key) do
        Map.put(acc, key, previous_context[key])
      else
        Map.delete(acc, key)
      end
    end)
  end

  defp append_execution_log(context, node, node_type, output_name, status, error) do
    log_entry =
      %{
        "node_id" => to_string(node["id"]),
        "node_type" => node_type,
        "status" => Atom.to_string(status),
        "output" => to_string(output_name),
        "context_keys" => context |> Map.drop(@internal_keys) |> Map.keys() |> Enum.sort()
      }
      |> maybe_put_error(error)

    logs = Map.get(context, "logs", [])
    Map.put(context, "logs", logs ++ [log_entry])
  end

  defp maybe_put_error(log_entry, nil), do: log_entry
  defp maybe_put_error(log_entry, error), do: Map.put(log_entry, "error", error)

  defp format_reason(reason) when is_binary(reason), do: reason
  defp format_reason(reason), do: inspect(reason)

  defp preserved_control_keys("Output"), do: ["status"]
  defp preserved_control_keys(_node_type), do: []

  defp process_connections(connections, context, flow) do
    Enum.reduce_while(connections, {:ok, context}, fn conn, {:ok, acc_context} ->
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
  end

  def run_from_webhook(flow, webhook_request) do
    webhook_node =
      Enum.find(flow.nodes, fn node ->
        (node["type"] || node["label"]) == "Webhook"
      end)

    if webhook_node do
      initial_context = %{
        "flow_id" => flow.id,
        "logs" => [],
        "body" => webhook_request["body"],
        "headers" => webhook_request["headers"],
        "method" => webhook_request["method"],
        "query_params" => webhook_request["query_params"],
        "request_path" => webhook_request["path"]
      }

      execute_node(webhook_node, initial_context, flow)
    else
      {:error, "No Webhook node found in flow", nil}
    end
  end

  defp normalize_input(input) when is_map(input) do
    Map.new(input, fn {key, value} -> {to_string(key), value} end)
  end

  defp normalize_input(_input), do: %{}

  defp get_node_module("Evaluate Code"), do: FusionFlowNodes.Nodes.Eval
  defp get_node_module("HTTP Request"), do: FusionFlowNodes.Nodes.HttpRequest

  defp get_node_module(name) do
    module_name = "Elixir.FusionFlowNodes.Nodes.#{String.replace(name, " ", "")}"

    try do
      String.to_existing_atom(module_name)
    rescue
      _ -> nil
    end
  end
end
