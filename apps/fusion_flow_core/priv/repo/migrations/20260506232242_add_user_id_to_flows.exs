defmodule FusionFlowCore.Repo.Migrations.AddUserIdToFlows do
  use Ecto.Migration

  def up do
    alter table(:flows) do
      add :user_id, references(:users, on_delete: :restrict)
    end

    execute("""
    UPDATE flows
    SET user_id = (
      SELECT id
      FROM users
      ORDER BY is_system_admin DESC, inserted_at ASC, id ASC
      LIMIT 1
    )
    WHERE user_id IS NULL
    """)

    alter table(:flows) do
      modify :user_id, :bigint, null: false
    end

    create index(:flows, [:user_id])
  end

  def down do
    drop index(:flows, [:user_id])

    alter table(:flows) do
      remove :user_id
    end
  end
end
