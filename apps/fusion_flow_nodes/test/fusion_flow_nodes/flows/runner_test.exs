defmodule FusionFlowNodes.RunnerTest do
  use FusionFlowCore.DataCase, async: true

  alias FusionFlowCore.Flows
  alias FusionFlowNodes.Runner

  describe "run/1" do
    test "keeps node controls scoped and records execution history" do
      {:ok, flow} =
        Flows.create_flow(%{
          name: "Scoped Context Flow",
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}},
            %{
              "id" => "2",
              "type" => "Variable",
              "label" => "Variable",
              "controls" => %{
                "var_name" => "x",
                "var_value" => "20",
                "var_type" => "Integer"
              }
            },
            %{
              "id" => "3",
              "type" => "Evaluate Code",
              "label" => "Evaluate Code",
              "controls" => %{
                "language" => "elixir",
                "code_elixir" => "set_result(variable!(:x) + 30)",
                "code_python" => ""
              }
            },
            %{
              "id" => "4",
              "type" => "Output",
              "label" => "Output",
              "controls" => %{"status" => "success"}
            }
          ],
          connections: [
            %{
              "source" => "1",
              "sourceOutput" => "exec",
              "target" => "2",
              "targetInput" => "exec"
            },
            %{
              "source" => "2",
              "sourceOutput" => "exec",
              "target" => "3",
              "targetInput" => "exec"
            },
            %{"source" => "3", "sourceOutput" => "exec", "target" => "4", "targetInput" => "exec"}
          ]
        })

      assert {:ok, context} = Runner.run(flow)

      assert context["variables"] == %{"x" => 20}
      assert context["result"] == 50
      assert context["status"] == "success"
      assert length(context["logs"]) == 4

      refute Map.has_key?(context, "var_name")
      refute Map.has_key?(context, "var_value")
      refute Map.has_key?(context, "var_type")
      refute Map.has_key?(context, "language")
      refute Map.has_key?(context, "code_elixir")
      refute Map.has_key?(context, "code_python")
      refute Map.has_key?(context, "input")
      refute Map.has_key?(context, "x")

      assert Enum.map(context["logs"], & &1["node_type"]) == [
               "Start",
               "Variable",
               "Evaluate Code",
               "Output"
             ]

      assert context["flow_id"] == flow.id
    end

    test "includes persisted execution input in the initial context" do
      {:ok, flow} =
        Flows.create_flow(%{
          name: "Input Flow",
          nodes: [
            %{"id" => "1", "type" => "Start", "label" => "Start", "controls" => %{}}
          ],
          connections: []
        })

      assert {:ok, context} = Runner.run(flow, %{"payload" => %{"value" => 42}})

      assert context["payload"] == %{"value" => 42}
    end
  end
end
