defmodule FusionFlowCore.FlowsFixtures do
  alias FusionFlowCore.Flows

  def flow_fixture(attrs \\ %{}) do
    attrs = Enum.into(attrs, %{})

    user =
      Map.get_lazy(attrs, :user, fn ->
        Process.get(:fusion_flow_owner) || FusionFlowCore.AccountsFixtures.user_fixture()
      end)

    {:ok, flow} =
      attrs
      |> Map.delete(:user)
      |> Enum.into(%{
        name: "Test Flow",
        nodes: [],
        connections: [],
        user_id: user.id
      })
      |> normalize_graph()
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

    {:ok, execution} = FusionFlowCore.Executions.create_execution(attrs)

    execution
  end

  defp normalize_graph(attrs) do
    nodes =
      attrs
      |> Map.get(:nodes, [])
      |> Enum.with_index()
      |> Enum.map(fn {node, index} ->
        Map.put_new(node, "position", %{"x" => index * 200, "y" => 0})
      end)

    Map.put(attrs, :nodes, nodes)
  end
end
