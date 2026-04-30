defmodule FusionFlow.Nodes.Eval do
  use FusionKit.Node

  alias FusionFlow.Runtime

  definition do
    %{
      name: "Evaluate Code",
      title: "Evaluate Code",
      category: :code,
      color: "bg-indigo-100 text-indigo-700",
      description: "Runs Elixir or Python code with access to the current flow context.",
      icon: "hero-code-bracket",
      inputs: [:exec],
      outputs: [:exec],
      show: true,
      ui_fields: [
        %{
          type: :select,
          name: :language,
          label: "Language",
          options: Runtime.languages(),
          default: Runtime.default_language()
        },
        %{
          type: :code,
          name: :code,
          label: "Code Editor",
          render: "button",
          language_field: :language,
          default: ""
        }
      ]
    }
  end

  @impl true
  def handler(context, input) do
    language = context["language"] || Runtime.default_language()
    code = code_for_language(context, language)
    context = put_input(context, input)
    runtime_context = expose_variables(context)

    case Runtime.execute(language, code, runtime_context) do
      {:ok, %{} = new_context} -> {:ok, collapse_exposed_variables(new_context), :exec}
      {:result, value} -> {:ok, Map.put(context, "result", value), :exec}
      {:error, reason} -> {:error, reason}
    end
  end

  defp code_for_language(context, language) do
    language_code = Map.get(context, Runtime.code_field(language))
    legacy_code = Map.get(context, "code")

    cond do
      is_binary(language_code) && String.trim(language_code) != "" -> language_code
      is_binary(legacy_code) -> legacy_code
      true -> ""
    end
  end

  defp put_input(context, nil), do: context
  defp put_input(context, input), do: Map.put(context, "input", input)

  defp expose_variables(context) do
    variables = Map.get(context, "variables", %{})

    Map.merge(variables, context)
  end

  defp collapse_exposed_variables(context) do
    variables = Map.get(context, "variables", %{})

    Enum.reduce(variables, context, fn {key, value}, acc ->
      if Map.get(acc, key) == value do
        Map.delete(acc, key)
      else
        acc
      end
    end)
  end
end
