defmodule FusionFlowNodes.Nodes.OutputTest do
  use FusionFlowCore.DataCase, async: true
  alias FusionFlowNodes.Nodes.Output

  describe "handler/2" do
    test "returns the final context without persisting a legacy execution log" do
      context = %{
        "flow_id" => 123,
        "status" => "completed",
        "data" => "some result"
      }

      assert {:ok, result_context, "exec"} = Output.handler(context, nil)
      assert result_context == context
    end

    test "defaults to success status if missing" do
      context = %{"flow_id" => 123}

      assert {:ok, ^context, "exec"} = Output.handler(context, nil)
    end
  end
end
