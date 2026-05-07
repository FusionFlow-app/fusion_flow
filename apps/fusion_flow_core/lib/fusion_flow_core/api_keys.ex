defmodule FusionFlowCore.ApiKeys do
  @moduledoc """
  API key management and authentication.
  """

  import Ecto.Query, warn: false

  alias FusionFlowCore.Accounts.User
  alias FusionFlowCore.ApiKeys.ApiKey
  alias FusionFlowCore.Repo

  @prefix_size 8
  @secret_size 32
  @max_create_attempts 5

  def create_api_key(%User{id: user_id}, attrs \\ %{}) do
    create_api_key(user_id, Map.new(attrs), @max_create_attempts)
  end

  defp create_api_key(user_id, attrs, attempts_left) when attempts_left > 0 do
    prefix = generate_prefix()
    token = build_token(prefix)

    attrs =
      attrs
      |> Map.new()
      |> Map.put(:user_id, user_id)
      |> Map.put(:prefix, prefix)
      |> Map.put(:key_hash, hash_token(token))
      |> Map.put_new(:name, "API key")
      |> Map.put_new(:scopes, [])

    case %ApiKey{} |> ApiKey.create_changeset(attrs) |> Repo.insert() do
      {:ok, api_key} ->
        {:ok, %{api_key: Repo.preload(api_key, :user), token: token}}

      {:error, changeset} ->
        if prefix_collision?(changeset) do
          create_api_key(user_id, Map.drop(attrs, [:prefix, :key_hash]), attempts_left - 1)
        else
          {:error, changeset}
        end
    end
  end

  defp create_api_key(user_id, attrs, 0) do
    prefix = generate_prefix()
    token = build_token(prefix)

    attrs =
      attrs
      |> Map.put(:user_id, user_id)
      |> Map.put(:prefix, prefix)
      |> Map.put(:key_hash, hash_token(token))
      |> Map.put_new(:name, "API key")
      |> Map.put_new(:scopes, [])

    case %ApiKey{} |> ApiKey.create_changeset(attrs) |> Repo.insert() do
      {:ok, api_key} -> {:ok, %{api_key: Repo.preload(api_key, :user), token: token}}
      {:error, changeset} -> {:error, changeset}
    end
  end

  def authenticate(token) when is_binary(token) do
    with {:ok, prefix} <- parse_prefix(token),
         %ApiKey{} = api_key <- get_by_prefix(prefix),
         true <- token_matches?(token, api_key),
         true <- ApiKey.active?(api_key) do
      {:ok, Repo.preload(touch_last_used(api_key), :user)}
    else
      _ -> :error
    end
  end

  def authenticate(_token), do: :error

  def revoke_api_key(%ApiKey{} = api_key) do
    api_key
    |> ApiKey.revoke_changeset()
    |> Repo.update()
  end

  def get_api_key!(id) do
    ApiKey
    |> Repo.get!(id)
    |> Repo.preload(:user)
  end

  def list_api_keys do
    Repo.all(from key in ApiKey, preload: [:user], order_by: [desc: key.inserted_at])
  end

  def list_api_keys(%User{id: user_id}) do
    Repo.all(
      from key in ApiKey,
        where: key.user_id == ^user_id,
        preload: [:user],
        order_by: [desc: key.inserted_at]
    )
  end

  def hash_token(token), do: :crypto.hash(:sha256, token)

  defp get_by_prefix(prefix), do: Repo.get_by(ApiKey, prefix: prefix)

  defp parse_prefix(token) do
    case String.split(token, "_", parts: 4) do
      ["ff", "live", prefix, secret]
      when byte_size(prefix) == @prefix_size and byte_size(secret) > 0 ->
        {:ok, prefix}

      _ ->
        :error
    end
  end

  defp build_token(prefix) do
    secret = @secret_size |> :crypto.strong_rand_bytes() |> Base.url_encode64(padding: false)
    "ff_live_#{prefix}_#{secret}"
  end

  defp generate_prefix do
    @prefix_size
    |> :crypto.strong_rand_bytes()
    |> Base.encode16(case: :lower)
    |> binary_part(0, 8)
  end

  defp prefix_collision?(changeset) do
    Keyword.has_key?(changeset.errors, :prefix)
  end

  defp token_matches?(token, %ApiKey{key_hash: key_hash}) do
    token_hash = hash_token(token)
    byte_size(token_hash) == byte_size(key_hash) and :crypto.hash_equals(token_hash, key_hash)
  end

  defp touch_last_used(%ApiKey{} = api_key) do
    now = DateTime.utc_now()

    should_update? =
      case api_key.last_used_at do
        nil -> true
        last_used -> DateTime.diff(now, last_used, :second) > 60
      end

    if should_update?, do: persist_last_used(api_key)

    %{api_key | last_used_at: if(should_update?, do: now, else: api_key.last_used_at)}
  end

  defp persist_last_used(%ApiKey{} = api_key) do
    task = fn ->
      case api_key |> ApiKey.touch_changeset() |> Repo.update() do
        {:ok, _api_key} -> :ok
        _ -> :error
      end
    end

    if Mix.env() == :test do
      task.()
    else
      Task.Supervisor.start_child(FusionFlowCore.TaskSupervisor, task)
    end
  end
end
