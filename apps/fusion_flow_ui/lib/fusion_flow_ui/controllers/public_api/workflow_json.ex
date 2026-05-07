defmodule FusionFlowUI.PublicAPI.WorkflowJSON do
  alias FusionFlowCore.Flows.Flow

  def index(%{workflows: workflows, meta: meta}) do
    %{data: Enum.map(workflows, &data/1), meta: meta}
  end

  def show(%{workflow: workflow}) do
    %{data: data(workflow)}
  end

  defp data(%Flow{} = workflow) do
    %{
      id: workflow.id,
      name: workflow.name,
      nodes: workflow.nodes || [],
      connections: workflow.connections || [],
      inserted_at: workflow.inserted_at,
      updated_at: workflow.updated_at
    }
  end
end
