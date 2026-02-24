defmodule FusionFlow.Repo.Migrations.AddIsSystemAdminToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :is_system_admin, :boolean, default: false, null: false
    end
  end
end
