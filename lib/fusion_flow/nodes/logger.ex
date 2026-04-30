defmodule FusionFlow.Nodes.Logger do
  use FusionKit.Node

  definition do
    %{
      name: "Logger",
      title: "Logger",
      category: :utility,
      color: "bg-gray-100 text-gray-600",
      description: "Writes a message to the application logs without changing the flow context.",
      icon: "hero-chat-bubble-bottom-center-text",
      inputs: [:exec],
      outputs: ["exec"],
      show: true,
      ui_fields: [
        %{
          type: :select,
          name: :level,
          label: "Level",
          options: [
            %{label: "Debug", value: "debug"},
            %{label: "Info", value: "info"},
            %{label: "Warning", value: "warning"},
            %{label: "Error", value: "error"}
          ],
          default: "info"
        },
        %{
          type: :text,
          name: :message,
          label: "Message",
          default: "Log message"
        }
      ]
    }
  end

  @impl true
  def handler(context, _input) do
    require Logger

    level = String.to_atom(context["level"] || "info")
    message = context["message"]

    Logger.log(level, message)

    {:ok, context, "exec"}
  end
end
