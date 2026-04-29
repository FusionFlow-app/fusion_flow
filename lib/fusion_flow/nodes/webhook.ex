defmodule FusionFlow.Nodes.Webhook do
  use FusionKit.Node

  definition do
    %{
      name: "Webhook",
      title: "Webhook",
      category: :trigger,
      description: "Starts a flow from an incoming webhook request.",
      icon: "hero-link",
      inputs: [],
      outputs: [:exec],
      show: true,
      ui_fields: [
        %{
          type: :select,
          name: :method,
          label: "Method",
          options: [
            %{label: "GET", value: "GET"},
            %{label: "POST", value: "POST"},
            %{label: "PUT", value: "PUT"},
            %{label: "DELETE", value: "DELETE"}
          ],
          default: "POST"
        },
        %{
          type: :text,
          name: :path,
          label: "Path",
          default: "/webhook"
        }
      ]
    }
  end

  @impl true
  def handler(context, _input) do
    {:ok,
     Map.merge(context, %{
       "webhook_method" => context["method"] || "POST",
       "webhook_path" => context["path"] || "/webhook"
     }), :exec}
  end
end
