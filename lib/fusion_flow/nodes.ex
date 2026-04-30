defmodule FusionFlow.Nodes do
  @moduledoc """
  Central registry for all node definitions.
  """

  alias FusionFlow.Nodes.{HttpRequest, Eval}

  @all_nodes [
    HttpRequest.definition(),
    Eval.definition(),
    FusionFlow.Nodes.Condition.definition(),
    FusionFlow.Nodes.Logger.definition(),
    FusionFlow.Nodes.Start.definition(),
    FusionFlow.Nodes.Webhook.definition(),
    FusionFlow.Nodes.Variable.definition(),
    FusionFlow.Nodes.Output.definition()
  ]

  @nodes_by_name Map.new(@all_nodes, fn n -> {n.name, n} end)

  def all_nodes do
    @all_nodes
  end

  def get_node(name) do
    Map.get(@nodes_by_name, name)
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
