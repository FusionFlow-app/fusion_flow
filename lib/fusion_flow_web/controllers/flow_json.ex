defmodule FusionFlowWeb.FlowJSON do
  alias FusionFlow.Flows.Flow

  @doc """
  Renders a list of flows.
  """
  def index(%{flows: flows}) do
    %{data: for(flow <- flows, do: data(flow))}
  end

  @doc """
  Renders a single flow.
  """
  def show(%{flow: flow}) do
    %{data: data(flow)}
  end

  defp data(%Flow{} = flow) do
    %{
      id: flow.id,
      name: flow.name,
      nodes: flow.nodes,
      connections: flow.connections,
      inserted_at: flow.inserted_at,
      updated_at: flow.updated_at
    }
  end
end
