defmodule FusionFlowUI.UserLive.IndexTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures

  describe "mount /users" do
    test "redirects non-admin to root with flash", %{conn: conn} do
      user = user_fixture()

      assert {:error, {:redirect, %{to: path}}} =
               conn
               |> log_in_user(user)
               |> live(~p"/users")

      assert path == ~p"/"
    end

    test "renders users page for system admin with current workspace", %{conn: conn} do
      admin = system_admin_fixture()
      {:ok, %{workspace: ws}} = FusionFlowCore.Workspaces.ensure_default_workspace(admin)
      _other = user_fixture()

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/users")

      assert html =~ "Users"
      assert html =~ "Invite to Current Workspace"
      assert html =~ admin.username
      assert html =~ ws.slug
    end

    test "generate_invite creates and shows invite link for current workspace", %{conn: conn} do
      admin = system_admin_fixture()
      {:ok, %{workspace: ws}} = FusionFlowCore.Workspaces.ensure_default_workspace(admin)

      {:ok, lv, _html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/users")

      lv
      |> form("form[phx-submit='generate_invite']", %{
        "role" => "editor",
        "email" => "invited@example.com"
      })
      |> render_submit()

      assert has_element?(lv, "input#invite-url")
      html = render(lv)
      assert html =~ "/users/register/"
      assert html =~ ws.slug
    end
  end
end
