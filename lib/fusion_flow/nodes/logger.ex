defmodule FusionFlow.Nodes.Logger do
  def definition do
    %{
      name: "Logger",
      category: :utility,
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
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            select :level, ["debug", "info", "warning", "error"], default: "info"
            text :message, label: "Message", default: "Log message"
          end
          """
        }
      ]
    }
  end

  def handler(context, _input) do
    require Logger

    level = String.to_atom(context["level"] || "info")
    message = context["message"]

    Logger.log(level, message)

    {:ok, context}
  end
end
