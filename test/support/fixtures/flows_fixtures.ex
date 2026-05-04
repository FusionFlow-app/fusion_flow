defmodule FusionFlow.FlowsFixtures do
  alias FusionFlow.Flows

  def flow_fixture(attrs \\ %{}) do
    {:ok, flow} =
      attrs
      |> Enum.into(%{
        name: "Test Flow",
        nodes: [],
        connections: []
      })
      |> Flows.create_flow()

    flow
  end

  def execution_fixture(attrs \\ %{}) do
    flow = Map.get_lazy(attrs, :flow, fn -> flow_fixture() end)

    attrs =
      attrs
      |> Map.delete(:flow)
      |> Enum.into(%{
        flow_id: flow.id,
        input: %{"source" => "test"}
      })

    {:ok, execution} = FusionFlow.Executions.create_execution(attrs)

    execution
  end
end
