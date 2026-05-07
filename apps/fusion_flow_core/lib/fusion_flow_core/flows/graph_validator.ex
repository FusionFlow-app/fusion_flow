defmodule FusionFlowCore.Flows.GraphValidator do
  @moduledoc """
  Validates persisted workflow graph payloads.

  The validator intentionally keeps `fusion_flow_core` decoupled from the nodes
  app. Callers can provide a manifest module with `:manifest`; otherwise the
  runtime-configured manifest or `FusionFlowNodes` is used when available.
  """

  @node_keys ~w(id type label controls position)
  @connection_keys ~w(source sourceOutput target targetInput)

  def validate(nodes, connections, opts \\ []) do
    with :ok <- validate_list(:nodes, nodes),
         :ok <- validate_list(:connections, connections) do
      validate_graph(nodes, connections, opts)
    end
  end

  defp validate_graph([], [], _opts), do: :ok

  defp validate_graph(nodes, connections, opts) do
    with {:ok, definitions} <- node_definitions(opts),
         :ok <- validate_nodes(nodes, definitions),
         :ok <- validate_connections(connections, nodes, definitions) do
      :ok
    end
  end

  defp validate_list(field, value) when is_list(value) do
    if Enum.all?(value, &is_map/1) do
      :ok
    else
      {:error, field, "must contain only objects"}
    end
  end

  defp validate_list(field, _value), do: {:error, field, "must be a list"}

  defp node_definitions(opts) do
    manifest =
      Keyword.get_lazy(opts, :manifest, fn ->
        Application.get_env(:fusion_flow_core, :graph_manifest, FusionFlowNodes)
      end)

    if Code.ensure_loaded?(manifest) and function_exported?(manifest, :get_definitions, 0) do
      definitions =
        manifest.get_definitions()
        |> Map.new(fn definition -> {Map.fetch!(definition, :name), definition} end)

      {:ok, definitions}
    else
      {:error, :nodes, "node manifest is unavailable"}
    end
  end

  defp validate_nodes(nodes, definitions) do
    node_ids = MapSet.new(Enum.map(nodes, &to_string(&1["id"])))

    Enum.reduce_while(nodes, :ok, fn node, :ok ->
      cond do
        unknown_keys?(node, @node_keys) ->
          {:halt, {:error, :nodes, "contains unknown node fields"}}

        not present_id?(node["id"]) ->
          {:halt, {:error, :nodes, "contains a node without id"}}

        MapSet.size(node_ids) != length(nodes) ->
          {:halt, {:error, :nodes, "contains duplicate node ids"}}

        not present_string?(node["type"]) && not present_string?(node["label"]) ->
          {:halt, {:error, :nodes, "contains a node without type"}}

        not is_map(node["position"]) ->
          {:halt, {:error, :nodes, "contains a node without position"}}

        not valid_position?(node["position"]) ->
          {:halt, {:error, :nodes, "contains a node with invalid position"}}

        not is_map(node["controls"]) ->
          {:halt, {:error, :nodes, "contains a node without controls"}}

        not Map.has_key?(definitions, node_type(node)) ->
          {:halt, {:error, :nodes, "contains unknown node type"}}

        true ->
          {:cont, :ok}
      end
    end)
  end

  defp validate_connections(connections, nodes, definitions) do
    nodes_by_id = Map.new(nodes, fn node -> {to_string(node["id"]), node} end)

    Enum.reduce_while(connections, :ok, fn connection, :ok ->
      source = to_string(connection["source"])
      target = to_string(connection["target"])
      source_node = nodes_by_id[source]
      target_node = nodes_by_id[target]

      cond do
        unknown_keys?(connection, @connection_keys) ->
          {:halt, {:error, :connections, "contains unknown connection fields"}}

        missing_connection_field?(connection) ->
          {:halt, {:error, :connections, "contains an incomplete connection"}}

        is_nil(source_node) or is_nil(target_node) ->
          {:halt, {:error, :connections, "references a missing node"}}

        not output_exists?(definitions, source_node, connection["sourceOutput"]) ->
          {:halt, {:error, :connections, "references an unknown source output"}}

        not input_exists?(definitions, target_node, connection["targetInput"]) ->
          {:halt, {:error, :connections, "references an unknown target input"}}

        true ->
          {:cont, :ok}
      end
    end)
  end

  defp missing_connection_field?(connection) do
    not present_id?(connection["source"]) or not present_id?(connection["target"]) or
      not present_string?(connection["sourceOutput"]) or
      not present_string?(connection["targetInput"])
  end

  defp output_exists?(definitions, node, output) do
    definitions
    |> Map.fetch!(node_type(node))
    |> Map.get(:outputs, [])
    |> Enum.map(&port_id/1)
    |> Enum.member?(to_string(output))
  end

  defp input_exists?(definitions, node, input) do
    definitions
    |> Map.fetch!(node_type(node))
    |> Map.get(:inputs, [])
    |> Enum.map(&port_id/1)
    |> Enum.member?(to_string(input))
  end

  defp port_id(port) when is_atom(port), do: Atom.to_string(port)
  defp port_id(port) when is_binary(port), do: port
  defp port_id(%{} = port), do: to_string(port[:id] || port["id"])

  defp node_type(node), do: node["type"] || node["label"]

  defp valid_position?(%{"x" => x, "y" => y}), do: number?(x) and number?(y)
  defp valid_position?(%{x: x, y: y}), do: number?(x) and number?(y)
  defp valid_position?(_position), do: false

  defp number?(value), do: is_integer(value) or is_float(value)

  defp present_id?(value) when is_binary(value), do: String.trim(value) != ""
  defp present_id?(value) when is_integer(value), do: true
  defp present_id?(_value), do: false

  defp present_string?(value) when is_binary(value), do: String.trim(value) != ""
  defp present_string?(_value), do: false

  defp unknown_keys?(map, allowed_keys) do
    map
    |> Map.keys()
    |> Enum.any?(&(to_string(&1) not in allowed_keys))
  end
end
