defmodule FusionFlow.Nodes.Eval do
  @moduledoc """
  Evaluate Code node definition.
  """

  def definition do
    %{
      name: "Evaluate Code",
      category: :code,
      icon: "</>",
      inputs: [:exec],
      outputs: [:exec],
      ui_fields: [
        %{
          type: :code,
          name: :code,
          label: "Code Editor",
          render: "button",
          language: "elixir",
          default: """
          result =
            input
            |> Enum.map(& &1 * 2)
            |> Enum.filter(&(&1 > 10))

          {:ok, result}
          """
        }
      ]
    }
  end

  def variable(name) do
    context = Process.get(:fusion_flow_eval_context, %{})
    key = to_string(name)
    Map.get(context, key)
  end

  def variable!(name) do
    context = Process.get(:fusion_flow_eval_context, %{})
    key = to_string(name)

    case Map.fetch(context, key) do
      {:ok, val} -> val
      :error -> raise "Variable '#{key}' not found in context"
    end
  end

  def handler(context, input) do
    Process.put(:fusion_flow_eval_context, context)

    code = context["code"] || ""
    code_with_imports = "import FusionFlow.Nodes.Eval; " <> code

    {result, diagnostics} =
      Code.with_diagnostics(fn ->
        try do
          {binding, _} = Code.eval_string(code_with_imports, input: input, context: context)
          {:ok, binding}
        rescue
          e -> {:error, e}
        catch
          kind, reason -> {:error, {kind, reason, __STACKTRACE__}}
        end
      end)

    Process.delete(:fusion_flow_eval_context)

    case result do
      {:ok, binding} ->
        case binding do
          {:ok, %{} = new_context} ->
            {:ok, new_context}

          %{} = new_context ->
            {:ok, new_context}

          other_value ->
            {:ok, Map.put(context, "last_result", other_value)}
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
