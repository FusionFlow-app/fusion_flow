defmodule FusionFlowUI.ApiKeyLiveTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures

  alias FusionFlowCore.ApiKeys
  alias FusionFlowCore.ApiKeys.ApiKey

  describe "mount /api-keys" do
    test "redirects non-admin to root with flash", %{conn: conn} do
      user = user_fixture()

      assert {:error, {:redirect, %{to: path}}} =
               conn
               |> log_in_user(user)
               |> live(~p"/api-keys")

      assert path == ~p"/"
    end

    test "renders API key management for system admin", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/api-keys")

      assert html =~ "API keys"
      assert html =~ "Create key"
      assert html =~ "Existing keys"
      assert html =~ "System admins only"
    end
  end

  describe "create" do
    test "creates an API key and shows the token only once", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/api-keys")

      html =
        lv
        |> form("#api-key-form", %{
          "api_key" => %{
            "name" => "Deploy key",
            "expires_in" => "30",
            "scopes" => ["flows:read", "flows:write"]
          }
        })
        |> render_submit()

      assert html =~ "Copy this token now"
      assert html =~ "ff_live_"
      assert html =~ "Deploy key"
      assert html =~ "flows:read"
      assert html =~ "flows:write"

      [api_key] = ApiKeys.list_api_keys(admin)
      assert api_key.name == "Deploy key"
      assert api_key.scopes == ["flows:read", "flows:write"]
      assert api_key.expires_at != nil

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/api-keys")

      refute html =~ "Copy this token now"
      refute html =~ "ff_live_"
      assert html =~ "Deploy key"
      assert html =~ api_key.prefix
    end
  end

  describe "revoke" do
    test "revokes an active API key", %{conn: conn} do
      admin = system_admin_fixture()
      {:ok, %{api_key: api_key}} = ApiKeys.create_api_key(admin, %{name: "CI key"})

      {:ok, lv, _html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/api-keys")

      html =
        lv
        |> element("#api-key-#{api_key.id} button", "Revoke")
        |> render_click()

      assert html =~ "Revoked"
      refute has_element?(lv, "#api-key-#{api_key.id} button", "Revoke")
      assert ApiKey.revoked?(ApiKeys.get_api_key!(api_key.id))
    end
  end
end
