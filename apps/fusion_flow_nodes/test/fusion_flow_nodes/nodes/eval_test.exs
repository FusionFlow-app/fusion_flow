defmodule FusionFlowNodes.Nodes.EvalTest do
  use ExUnit.Case, async: true
  alias FusionFlowNodes.Nodes.Eval

  describe "handler/2" do
    test "executes Elixir code correctly" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "variable(:a) + variable!(:b)",
        "a" => 10,
        "b" => 20
      }

      assert {:ok, %{"result" => 30}, :exec} = Eval.handler(context, nil)
    end

    test "executes Python code correctly" do
      context = %{
        "language" => "python",
        "code_python" => "a + b",
        "a" => 10,
        "b" => 20
      }

      assert {:ok, %{"result" => 30}, :exec} = Eval.handler(context, nil)
    end

    test "executes Python code with structured variables" do
      context = %{
        "language" => "python",
        "code_python" => "set_result(x + 30)",
        "variables" => %{"x" => 20}
      }

      assert {:ok, %{"result" => 50, "variables" => %{"x" => 20}}, :exec} =
               Eval.handler(context, nil)
    end

    test "falls back to legacy code field when language-specific field is blank" do
      context = %{
        "language" => "python",
        "code" => "set_result(50)",
        "code_python" => "",
        "result" => 20
      }

      assert {:ok, %{"result" => 50}, :exec} = Eval.handler(context, nil)
    end

    test "does not expose nil input in the result context" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "set_result(50)"
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      refute Map.has_key?(result, "input")
    end

    test "handles Elixir errors gracefully" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "raise \"error\""
      }

      assert {:error, _reason} = Eval.handler(context, nil)
    end

    test "handles Python errors gracefully" do
      context = %{
        "language" => "python",
        "code_python" => "raise Exception('error')"
      }

      assert {:error, _reason} = Eval.handler(context, nil)
    end

    test "merges non-nil input into context before execution" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "set_result(42)"
      }

      assert {:ok, result, :exec} = Eval.handler(context, "some_input")
      assert result["result"] == 42
      assert result["input"] == "some_input"
    end

    test "uses empty string when no code field is present" do
      context = %{"language" => "elixir"}

      assert {:ok, _result, :exec} = Eval.handler(context, nil)
    end

    test "exposes variables dict into flat context for execution" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "set_result(variable!(:x) * 2)",
        "variables" => %{"x" => 5}
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      assert result["result"] == 10
    end

    test "collapses exposed variable keys that were unchanged back into variables dict" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "set_result(42)",
        "variables" => %{"x" => 10}
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      refute Map.has_key?(result, "x")
      assert result["variables"]["x"] == 10
    end

    test "keeps variable key in flat context when its value was mutated" do
      context = %{
        "language" => "python",
        "code_python" => "x = 99\nset_result(x)",
        "variables" => %{"x" => 10}
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      assert result["result"] == 99
    end

    test "handles runtime returning a full context map (ok tuple path)" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "context"
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      assert is_map(result)
    end

    test "collapses unchanged variable keys when runtime returns a new context map" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "context",
        "variables" => %{"x" => 10}
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      refute Map.has_key?(result, "x")
      assert result["variables"]["x"] == 10
    end

    test "keeps mutated variable in flat context when runtime returns a new context map" do
      context = %{
        "language" => "elixir",
        "code_elixir" => "Map.put(context, \"x\", 999)",
        "variables" => %{"x" => 10}
      }

      assert {:ok, result, :exec} = Eval.handler(context, nil)
      assert result["x"] == 999
    end
  end
end
