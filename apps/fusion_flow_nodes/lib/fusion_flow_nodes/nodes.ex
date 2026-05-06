defmodule FusionFlowNodes.Nodes do
  @moduledoc """
  Central registry for all node definitions.
  """

  def all_nodes do
    FusionFlowNodes.get_definitions()
  end

  def get_node(name) do
    Enum.find(all_nodes(), fn node -> node.name == name end)
  end

  def get_node_module(name) do
    FusionFlowNodes.get_node_module(name)
  end

  def nodes_by_category do
    all_nodes()
    |> Enum.filter(fn node -> Map.get(node, :show, true) end)
    |> Enum.group_by(& &1.category)
  end

  def visible_nodes do
    all_nodes()
    |> Enum.filter(fn node -> Map.get(node, :show, true) end)
  end

  def category_label(category) do
    category
    |> to_string()
    |> String.split("_")
    |> Enum.map_join(" ", &String.capitalize/1)
  end
end
