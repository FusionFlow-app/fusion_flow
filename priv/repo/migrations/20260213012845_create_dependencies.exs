defmodule FusionFlow.Repo.Migrations.CreateDependencies do
  use Ecto.Migration

  def change do
    create table(:dependencies) do
      add :name, :string, null: false
      add :version, :string, null: false
      add :language, :string, null: false

      timestamps()
    end

    create unique_index(:dependencies, [:name, :language])
  end
end
