defmodule FusionFlow.Runtime.Elixir do
  @behaviour FusionFlow.Runtime.Executor

  def language, do: "elixir"

  def variable(name) do
    context = Process.get(:fusion_flow_eval_context, %{})
    Map.get(context, to_string(name))
  end

  def variable!(name) do
    context = Process.get(:fusion_flow_eval_context, %{})
    key = to_string(name)

    case Map.fetch(context, key) do
      {:ok, val} -> val
      :error -> raise "Variable '#{key}' not found in context"
    end
  end

  def set_result(value) do
    Process.put(:fusion_flow_eval_output, {:set, value})
    value
  end

  def execute(code, context) do
    Process.put(:fusion_flow_eval_context, context)
    Process.delete(:fusion_flow_eval_output)

    code_with_imports = "import FusionFlow.Runtime.Elixir; " <> (code || "")

    {result, diagnostics} =
      Code.with_diagnostics(fn ->
        try do
          last_result = context["result"]
          bindings = [input: context["input"], context: context, result: last_result]

          {binding, _} = Code.eval_string(code_with_imports, bindings)
          {:ok, binding}
        rescue
          e -> {:error, e}
        catch
          kind, reason -> {:error, {kind, reason, __STACKTRACE__}}
        end
      end)

    explicit_output = Process.get(:fusion_flow_eval_output)
    Process.delete(:fusion_flow_eval_context)
    Process.delete(:fusion_flow_eval_output)

    case result do
      {:ok, binding} ->
        value =
          case explicit_output do
            {:set, val} -> {:explicit, val}
            _ -> {:auto, binding}
          end

        case value do
          {:explicit, %{} = new_context} ->
            {:ok, new_context}

          {:explicit, val} ->
            {:result, val}

          {:auto, {:ok, %{} = new_context}} ->
            {:ok, new_context}

          {:auto, %{} = new_context} ->
            {:ok, new_context}

          {:auto, {:ok, val}} ->
            {:result, val}

          {:auto, val} ->
            {:result, val}
        end

      {:error, exception_or_reason} ->
        error_message =
          if diagnostics != [] do
            format_diagnostics(diagnostics)
          else
            case exception_or_reason do
              {kind, reason, stack} -> Exception.format(kind, reason, stack)
              e -> Exception.message(e)
            end
          end

        {:error, error_message}
    end
  end

  defp format_diagnostics(diagnostics) do
    diagnostics
    |> Enum.map(fn diag ->
      "Error on line #{diag.position}: #{diag.message}"
    end)
    |> Enum.join("\n")
  end
end
