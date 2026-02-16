defmodule FusionFlow.Nodes.Cron do
  def definition do
    %{
      name: "Cron",
      category: :trigger,
      icon: "⏱",
      inputs: [],
      outputs: ["exec"],
      ui_fields: [
        %{
          type: :text,
          name: :expression,
          label: "Cron Expression",
          default: "* * * * *"
        },
        %{
          type: :text,
          name: :timezone,
          label: "Timezone",
          default: "UTC"
        },
        %{
          type: :code,
          name: :code,
          label: "Logic",
          language: "elixir",
          default: """
          ui do
            text :expression, label: "Cron Expression", default: "* * * * *"
            text :timezone, label: "Timezone", default: "UTC"
          end
          """
        }
      ]
    }
  end

  def handler(_context, _input) do
    {:ok, %{triggered_at: DateTime.utc_now()}}
  end
end
