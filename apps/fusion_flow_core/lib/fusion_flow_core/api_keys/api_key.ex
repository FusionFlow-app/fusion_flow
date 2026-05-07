defmodule FusionFlowCore.ApiKeys.ApiKey do
  use Ecto.Schema
  import Ecto.Changeset

  alias FusionFlowCore.Accounts.User

  @scopes ~w(
    flows:read
    flows:write
    flows:delete
    workflows:read
    workflows:write
    workflows:delete
    executions:read
    executions:write
    nodes:read
    webhooks:read
    webhooks:write
    webhooks:delete
    api_keys:read
    api_keys:write
    api_keys:delete
    admin
  )

  schema "api_keys" do
    field :name, :string
    field :prefix, :string
    field :key_hash, :binary, redact: true
    field :scopes, {:array, :string}, default: []
    field :last_used_at, :utc_datetime
    field :expires_at, :utc_datetime
    field :revoked_at, :utc_datetime

    belongs_to :user, User

    timestamps(type: :utc_datetime)
  end

  def scopes, do: @scopes

  def create_changeset(api_key, attrs) do
    api_key
    |> cast(attrs, [:user_id, :name, :prefix, :key_hash, :scopes, :expires_at])
    |> validate_required([:user_id, :name, :prefix, :key_hash, :scopes])
    |> validate_length(:name, min: 1, max: 120)
    |> validate_format(:prefix, ~r/^[a-zA-Z0-9]{8}$/)
    |> validate_subset(:scopes, @scopes)
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:prefix)
  end

  def revoke_changeset(api_key) do
    change(api_key, revoked_at: DateTime.utc_now(:second))
  end

  def touch_changeset(api_key) do
    change(api_key, last_used_at: DateTime.utc_now(:second))
  end

  def revoked?(%__MODULE__{revoked_at: revoked_at}), do: not is_nil(revoked_at)

  def expired?(%__MODULE__{expires_at: nil}), do: false

  def expired?(%__MODULE__{expires_at: expires_at}) do
    DateTime.compare(DateTime.utc_now(:second), expires_at) != :lt
  end

  def active?(%__MODULE__{} = api_key), do: not revoked?(api_key) and not expired?(api_key)

  def allows?(%__MODULE__{scopes: scopes}, scope) when is_binary(scope) do
    "admin" in scopes or scope in scopes
  end

  def allows?(%__MODULE__{} = api_key, scopes) when is_list(scopes) do
    Enum.all?(scopes, &allows?(api_key, &1))
  end
end
