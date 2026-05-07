defmodule FusionFlowCore.Flows.GraphValidatorTest do
  use ExUnit.Case, async: true

  alias FusionFlowCore.Flows.GraphValidator

  defmodule Manifest do
    def get_definitions do
      [
        %{
          name: "Start",
          inputs: [],
          outputs: ["exec"]
        },
        %{
          name: "Output",
          inputs: ["exec"],
          outputs: []
        }
      ]
    end
  end

  @valid_nodes [
    %{
      "id" => "start",
      "type" => "Start",
      "label" => "Start",
      "controls" => %{},
      "position" => %{"x" => 0, "y" => 0}
    },
    %{
      "id" => "output",
      "type" => "Output",
      "label" => "Output",
      "controls" => %{},
      "position" => %{"x" => 200, "y" => 0}
    }
  ]

  @valid_connections [
    %{
      "source" => "start",
      "sourceOutput" => "exec",
      "target" => "output",
      "targetInput" => "exec"
    }
  ]

  describe "validate/3" do
    test "accepts an empty graph without loading a manifest" do
      assert GraphValidator.validate([], [], manifest: MissingManifest) == :ok
    end

    test "accepts valid Rete graph payload" do
      assert GraphValidator.validate(@valid_nodes, @valid_connections, manifest: Manifest) == :ok
    end

    test "rejects node types missing from manifest" do
      nodes = [
        %{
          "id" => "bad",
          "type" => "Missing",
          "controls" => %{},
          "position" => %{"x" => 0, "y" => 0}
        }
      ]

      assert {:error, :nodes, "contains unknown node type"} =
               GraphValidator.validate(nodes, [], manifest: Manifest)
    end

    test "rejects dangerous unknown node fields" do
      [node | rest] = @valid_nodes
      nodes = [Map.put(node, "module", "Elixir.System") | rest]

      assert {:error, :nodes, "contains unknown node fields"} =
               GraphValidator.validate(nodes, @valid_connections, manifest: Manifest)
    end

    test "rejects dangerous unknown connection fields" do
      [connection] = @valid_connections
      connections = [Map.put(connection, "eval", "System.cmd")]

      assert {:error, :connections, "contains unknown connection fields"} =
               GraphValidator.validate(@valid_nodes, connections, manifest: Manifest)
    end

    test "rejects connections to missing nodes" do
      [connection] = @valid_connections
      connections = [%{connection | "target" => "missing"}]

      assert {:error, :connections, "references a missing node"} =
               GraphValidator.validate(@valid_nodes, connections, manifest: Manifest)
    end

    test "rejects connections with unknown source output" do
      [connection] = @valid_connections
      connections = [%{connection | "sourceOutput" => "missing"}]

      assert {:error, :connections, "references an unknown source output"} =
               GraphValidator.validate(@valid_nodes, connections, manifest: Manifest)
    end

    test "rejects connections with unknown target input" do
      [connection] = @valid_connections
      connections = [%{connection | "targetInput" => "missing"}]

      assert {:error, :connections, "references an unknown target input"} =
               GraphValidator.validate(@valid_nodes, connections, manifest: Manifest)
    end
  end
end
