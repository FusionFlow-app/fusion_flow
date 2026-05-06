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
  end
end
