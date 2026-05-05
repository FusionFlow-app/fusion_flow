defmodule FusionFlowCore.Repo.Migrations.AddPublicIdToExecutions do
  use Ecto.Migration

  def up do
    alter table(:executions) do
      add :public_id, :string
    end

    execute """
    UPDATE executions
    SET public_id = 'legacy-execution-' || id::text
    WHERE public_id IS NULL
    """

    alter table(:executions) do
      modify :public_id, :string, null: false
    end

    create unique_index(:executions, [:public_id])
  end

  def down do
    drop index(:executions, [:public_id])

    alter table(:executions) do
      remove :public_id
    end
  end
end
