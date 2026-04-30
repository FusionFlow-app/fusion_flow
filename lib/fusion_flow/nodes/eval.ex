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
    code = context[Runtime.code_field(language)] || context["code"] || ""
    context = Map.put(context, "input", input)

    case Runtime.execute(language, code, context) do
      {:ok, %{} = new_context} -> {:ok, new_context, :exec}
      {:result, value} -> {:ok, Map.put(context, "result", value), :exec}
      {:error, reason} -> {:error, reason}
    end
  end
end
