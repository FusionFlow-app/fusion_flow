defmodule FusionFlow.Nodes.Webhook do
  def definition do
    %{
      name: "Webhook",
      category: :trigger,
      icon: "🔗",
      inputs: [],
      outputs: ["exec"],
      ui_fields: [
        %{
          type: :select,
          name: :method,
          label: "Method",
          options: [
            %{label: "GET", value: "GET"},
            %{label: "POST", value: "POST"}
          ],
          default: "POST"
        },
        %{
          type: :text,
          name: :path,
          label: "Path",
          default: "/webhook/uuid"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            select :method, ["GET", "POST"], default: "POST"
            text :path, label: "Path", default: "/webhook/uuid"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    {:ok, %{body: context["body"], headers: context["headers"]}}
  end
end
