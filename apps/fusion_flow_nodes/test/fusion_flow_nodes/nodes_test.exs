defmodule FusionFlowNodes.NodesTest do
  use ExUnit.Case, async: true

  alias FusionFlowNodes.Nodes

  describe "all_nodes/0" do
    test "returns a non-empty list of node definitions" do
      nodes = Nodes.all_nodes()
      assert is_list(nodes)
      assert length(nodes) > 0
    end

    test "each definition has at least a name and module" do
      for definition <- Nodes.all_nodes() do
        assert is_binary(definition.name)
        assert is_atom(definition.module)
      end
    end
  end

  describe "get_node/1" do
    test "finds a node definition by name" do
      definition = Nodes.get_node("Start")
      assert definition != nil
      assert definition.name == "Start"
    end

    test "finds HTTP Request node by name" do
      definition = Nodes.get_node("HTTP Request")
      assert definition != nil
      assert definition.name == "HTTP Request"
    end

    test "returns nil for unknown node names" do
      assert Nodes.get_node("NonExistentNode") == nil
    end

    test "returns nil for empty string" do
      assert Nodes.get_node("") == nil
    end
  end

  describe "get_node_module/1" do
    test "returns the module for a known node name" do
      assert Nodes.get_node_module("Start") == FusionFlowNodes.Nodes.Start
    end

    test "returns nil for unknown node names" do
      assert Nodes.get_node_module("Unknown") == nil
    end
  end

  describe "nodes_by_category/0" do
    test "returns a map grouped by category" do
      by_category = Nodes.nodes_by_category()
      assert is_map(by_category)
      assert map_size(by_category) > 0
    end

    test "excludes nodes where show is false" do
      by_category = Nodes.nodes_by_category()
      all_visible = by_category |> Map.values() |> List.flatten()

      for node <- all_visible do
        assert Map.get(node, :show, true) == true
      end
    end

    test "includes trigger category with Webhook node" do
      by_category = Nodes.nodes_by_category()
      trigger_nodes = Map.get(by_category, :trigger, [])
      names = Enum.map(trigger_nodes, & &1.name)
      assert "Webhook" in names
    end
  end

  describe "visible_nodes/0" do
    test "returns only nodes where show is true" do
      visible = Nodes.visible_nodes()
      assert is_list(visible)
      assert length(visible) > 0

      for node <- visible do
        assert Map.get(node, :show, true) == true
      end
    end

    test "includes well-known visible nodes" do
      names = Nodes.visible_nodes() |> Enum.map(& &1.name)
      assert "Start" in names
      assert "Webhook" in names
      assert "HTTP Request" in names
    end
  end

  describe "category_label/1" do
    test "converts atom to a human-readable label" do
      assert Nodes.category_label(:flow_control) == "Flow Control"
    end

    test "handles single-word categories" do
      assert Nodes.category_label(:integration) == "Integration"
    end

    test "handles trigger category" do
      assert Nodes.category_label(:trigger) == "Trigger"
    end

    test "handles multi-word categories" do
      assert Nodes.category_label(:some_long_category) == "Some Long Category"
    end
  end
end
