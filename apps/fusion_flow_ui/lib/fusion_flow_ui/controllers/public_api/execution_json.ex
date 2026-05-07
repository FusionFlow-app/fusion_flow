defmodule FusionFlowUI.PublicAPI.ExecutionJSON do
  alias FusionFlowCore.Executions.Execution

  def index(%{executions: executions, meta: meta}) do
    %{data: Enum.map(executions, &data/1), meta: meta}
  end

  def show(%{execution: execution}) do
    %{data: data(execution)}
  end

  defp data(%Execution{} = execution) do
    %{
      id: execution.public_id,
      internal_id: execution.id,
      workflow_id: execution.flow_id,
      status: execution.status,
      input: execution.input || %{},
      result: execution.result,
      error: execution.error,
      logs: execution.logs || [],
      started_at: execution.started_at,
      finished_at: execution.finished_at,
      inserted_at: execution.inserted_at,
      updated_at: execution.updated_at
    }
  end
end
