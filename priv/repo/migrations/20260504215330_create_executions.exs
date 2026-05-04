defmodule FusionFlow.Repo.Migrations.CreateExecutions do
  use Ecto.Migration

  def change do
    create table(:executions, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :flow_id, references(:flows, on_delete: :delete_all), null: false
      add :status, :string, null: false, default: "queued"
      add :input, :map, null: false, default: %{}
      add :result, :map
      add :error, :map
      add :logs, {:array, :map}, null: false, default: []
      add :started_at, :utc_datetime
      add :finished_at, :utc_datetime

      timestamps(type: :utc_datetime)
    end

    create index(:executions, [:flow_id])
    create index(:executions, [:status])

    create constraint(:executions, :executions_status_check,
             check: "status in ('queued', 'running', 'succeeded', 'failed')"
           )
  end
end
