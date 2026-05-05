defmodule FusionFlowNodes.ManifestTest do
  use ExUnit.Case, async: true

  describe "manifest/0" do
    test "registers all built-in node modules" do
      assert FusionFlowNodes.available_nodes() == [
               FusionFlowNodes.Nodes.Start,
               FusionFlowNodes.Nodes.Webhook,
               FusionFlowNodes.Nodes.Variable,
               FusionFlowNodes.Nodes.Eval,
               FusionFlowNodes.Nodes.HttpRequest,
               FusionFlowNodes.Nodes.Condition,
               FusionFlowNodes.Nodes.Logger,
               FusionFlowNodes.Nodes.Output
             ]
    end

    test "returns definitions with module references" do
      definitions = FusionFlowNodes.get_definitions()

      assert Enum.any?(definitions, fn definition ->
               definition.name == "Start" and definition.module == FusionFlowNodes.Nodes.Start
             end)
    end

    test "finds node modules by definition name" do
      assert FusionFlowNodes.get_node_module("Evaluate Code") == FusionFlowNodes.Nodes.Eval
      assert FusionFlowNodes.get_node_module("Missing") == nil
    end
  end
end
