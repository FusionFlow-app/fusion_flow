defmodule FusionFlowNodes.Nodes.ConditionTest do
  use ExUnit.Case, async: true
  alias FusionFlowNodes.Nodes.Condition

  describe "handler/2" do
    test "evaluates equal condition correctly" do
      context = %{"variable" => "age", "operator" => "==", "value" => "25", "age" => "25"}
      assert Condition.handler(context, nil) == {:ok, context, "true"}

      context = %{"variable" => "age", "operator" => "==", "value" => "25", "age" => "30"}
      assert Condition.handler(context, nil) == {:ok, context, "false"}
    end

    test "evaluates not equal condition correctly" do
      context = %{"variable" => "name", "operator" => "!=", "value" => "John", "name" => "Jane"}
      assert Condition.handler(context, nil) == {:ok, context, "true"}

      context = %{"variable" => "name", "operator" => "!=", "value" => "John", "name" => "John"}
      assert Condition.handler(context, nil) == {:ok, context, "false"}
    end

    test "evaluates greater than condition correctly" do
      context = %{"variable" => "score", "operator" => ">", "value" => "10", "score" => 15}
      assert Condition.handler(context, nil) == {:ok, context, "true"}

      context = %{"variable" => "score", "operator" => ">", "value" => "10", "score" => 5}
      assert Condition.handler(context, nil) == {:ok, context, "false"}
    end

    test "evaluates less than condition correctly" do
      context = %{"variable" => "temp", "operator" => "<", "value" => "20", "temp" => "15"}
      assert Condition.handler(context, nil) == {:ok, context, "true"}

      context = %{"variable" => "temp", "operator" => "<", "value" => "20", "temp" => "25"}
      assert Condition.handler(context, nil) == {:ok, context, "false"}
    end

    test "evaluates contains condition correctly" do
      context = %{
        "variable" => "text",
        "operator" => "contains",
        "value" => "hello",
        "text" => "hello world"
      }

      assert Condition.handler(context, nil) == {:ok, context, "true"}

      context = %{
        "variable" => "text",
        "operator" => "contains",
        "value" => "bye",
        "text" => "hello world"
      }

      assert Condition.handler(context, nil) == {:ok, context, "false"}
    end

    test "reads variable from the variables dict when not in flat context" do
      context = %{
        "variable" => "score",
        "operator" => "==",
        "value" => "100",
        "variables" => %{"score" => "100"}
      }

      assert {:ok, ^context, "true"} = Condition.handler(context, nil)
    end

    test "returns false for unknown operators" do
      context = %{"variable" => "x", "operator" => "UNKNOWN", "value" => "5", "x" => "5"}

      assert {:ok, ^context, "false"} = Condition.handler(context, nil)
    end

    test "uses == as default operator when operator is nil" do
      context = %{"variable" => "name", "value" => "Alice", "name" => "Alice"}

      assert {:ok, ^context, "true"} = Condition.handler(context, nil)
    end

    test "compares nil variable to empty string" do
      context = %{"variable" => "missing", "operator" => "==", "value" => ""}

      assert {:ok, ^context, "true"} = Condition.handler(context, nil)
    end

    test "numeric comparison with integer values" do
      context = %{"variable" => "n", "operator" => ">", "value" => "0", "n" => 5}
      assert {:ok, ^context, "true"} = Condition.handler(context, nil)

      context = %{"variable" => "n", "operator" => "<", "value" => "10", "n" => 3}
      assert {:ok, ^context, "true"} = Condition.handler(context, nil)
    end

    test "numeric comparison treats non-numeric strings as 0" do
      context = %{"variable" => "x", "operator" => ">", "value" => "0", "x" => "abc"}
      assert {:ok, ^context, "false"} = Condition.handler(context, nil)
    end

    test "numeric comparison with nil variable treats it as 0" do
      context = %{"variable" => "missing_var", "operator" => ">", "value" => "1"}
      assert {:ok, ^context, "false"} = Condition.handler(context, nil)
    end
  end
end
