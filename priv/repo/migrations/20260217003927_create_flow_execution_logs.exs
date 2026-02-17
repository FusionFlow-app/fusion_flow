defmodule FusionFlow.Repo.Migrations.CreateFlowExecutionLogs do
  use Ecto.Migration

  def change do
    create table(:flow_execution_logs, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :flow_id, references(:flows, on_delete: :nothing)
      add :context, :map
      add :status, :string
      add :node_id, :string

      timestamps()
    end

    create index(:flow_execution_logs, [:flow_id])
  end
end
