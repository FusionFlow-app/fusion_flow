defmodule FusionFlow.Nodes.Registry do
  @moduledoc """
  Central registry for all node definitions.
  """

  alias FusionFlow.Nodes.{HttpRequest, Eval}

  def all_nodes do
    [
      HttpRequest.definition(),
      Eval.definition(),
      FusionFlow.Nodes.Condition.definition(),
      FusionFlow.Nodes.PatternMatch.definition(),
      FusionFlow.Nodes.Logger.definition(),
      FusionFlow.Nodes.Start.definition(),
      FusionFlow.Nodes.Webhook.definition(),
      FusionFlow.Nodes.Cron.definition(),
      FusionFlow.Nodes.SplitInBatches.definition(),
      FusionFlow.Nodes.Merge.definition(),
      FusionFlow.Nodes.Set.definition(),
      FusionFlow.Nodes.Variable.definition(),
      FusionFlow.Nodes.Output.definition(),
      FusionFlow.Nodes.Postgres.definition()
    ]
  end

  def get_node(name) do
    all_nodes()
    |> Enum.find(&(&1.name == name))
  end

  def nodes_by_category do
    all_nodes()
    |> Enum.filter(fn node -> Map.get(node, :show, true) end)
    |> Enum.group_by(& &1.category)
  end
end
