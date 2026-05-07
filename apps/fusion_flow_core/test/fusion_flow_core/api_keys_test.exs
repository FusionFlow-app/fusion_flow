defmodule FusionFlowCore.ApiKeysTest do
  use FusionFlowCore.DataCase

  alias FusionFlowCore.ApiKeys
  alias FusionFlowCore.ApiKeys.ApiKey

  import FusionFlowCore.AccountsFixtures

  describe "create_api_key/2" do
    test "returns the token once and stores only prefix/hash" do
      user = user_fixture()

      assert {:ok, %{api_key: %ApiKey{} = api_key, token: token}} =
               ApiKeys.create_api_key(user, %{name: "Deploy key", scopes: ["flows:read"]})

      assert token =~ ~r/^ff_live_[a-f0-9]{8}_/
      assert api_key.name == "Deploy key"
      assert api_key.scopes == ["flows:read"]
      assert api_key.prefix != nil
      assert api_key.key_hash == ApiKeys.hash_token(token)
      refute token == api_key.key_hash
    end

    test "validates scopes" do
      user = user_fixture()

      assert {:error, changeset} =
               ApiKeys.create_api_key(user, %{name: "bad", scopes: ["flows:own"]})

      assert "has an invalid entry" in errors_on(changeset).scopes
    end

    test "accepts administrative api key scopes" do
      user = user_fixture()

      assert {:ok, %{api_key: api_key}} =
               ApiKeys.create_api_key(user, %{
                 name: "Admin API key",
                 scopes: ["api_keys:read", "api_keys:write", "api_keys:delete"]
               })

      assert api_key.scopes == ["api_keys:read", "api_keys:write", "api_keys:delete"]
    end
  end

  describe "authenticate/1" do
    test "authenticates an active key" do
      user = user_fixture()
      {:ok, %{api_key: api_key, token: token}} = ApiKeys.create_api_key(user, %{scopes: []})

      assert {:ok, authenticated_key} = ApiKeys.authenticate(token)
      assert authenticated_key.id == api_key.id
      assert authenticated_key.user.id == user.id
      assert authenticated_key.last_used_at != nil
    end

    test "rejects invalid tokens" do
      assert ApiKeys.authenticate("ff_live_badtoken") == :error
      assert ApiKeys.authenticate(nil) == :error
    end

    test "rejects revoked keys" do
      user = user_fixture()
      {:ok, %{api_key: api_key, token: token}} = ApiKeys.create_api_key(user, %{scopes: []})
      {:ok, _api_key} = ApiKeys.revoke_api_key(api_key)

      assert ApiKeys.authenticate(token) == :error
    end

    test "rejects expired keys" do
      user = user_fixture()

      assert {:ok, %{token: token}} =
               ApiKeys.create_api_key(user, %{
                 scopes: [],
                 expires_at: DateTime.add(DateTime.utc_now(:second), -60, :second)
               })

      assert ApiKeys.authenticate(token) == :error
    end
  end
end
