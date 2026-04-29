defmodule FusionFlow.Nodes.Cron do
  def definition do
    %{
      name: "Cron",
      category: :trigger,
      description: "Starts a flow on a cron schedule.",
      icon: "hero-clock",
      inputs: [],
      outputs: ["exec"],
      show: false,
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
        }
      ]
    }
  end

  def handler(_context, _input) do
    {:ok, %{triggered_at: DateTime.utc_now()}}
  end
end
