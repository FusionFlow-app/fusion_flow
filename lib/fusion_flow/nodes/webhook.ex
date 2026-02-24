defmodule FusionFlow.Nodes.Webhook do
  def definition do
    %{
      name: "Webhook",
      category: :trigger,
      icon: "hero-link",
      inputs: [],
      outputs: ["exec"],
      show: false,
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
        }
      ]
    }
  end

  def handler(context, _input) do
    {:ok, %{body: context["body"], headers: context["headers"]}}
  end
end
