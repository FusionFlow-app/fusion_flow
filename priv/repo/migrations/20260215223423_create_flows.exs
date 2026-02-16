defmodule FusionFlow.Repo.Migrations.CreateFlows do
  use Ecto.Migration

  def change do
    create table(:flows) do
      add :name, :string
      add :nodes, :map
      add :connections, :map

      timestamps(type: :utc_datetime)
    end
  end
end
