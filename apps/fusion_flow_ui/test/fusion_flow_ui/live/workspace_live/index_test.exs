defmodule FusionFlowUI.WorkspaceLive.IndexTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures

  alias FusionFlowCore.Workspaces

  describe "mount" do
    test "requires authentication", %{conn: conn} do
      assert {:error, redirect} = live(conn, ~p"/workspaces")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "renders workspaces and member list for authenticated user", %{conn: conn} do
      user = user_fixture()
      {:ok, %{workspace: ws}} = Workspaces.ensure_default_workspace(user)

      {:ok, _lv, html} =
        conn
        |> log_in_user(user)
        |> live(~p"/workspaces")

      assert html =~ "Workspace Settings"
      assert html =~ ws.slug
      assert html =~ user.username
    end
  end

  describe "workspaces and member actions" do
    test "creates a new workspace", %{conn: conn} do
      user = user_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(user)
        |> live(~p"/workspaces")

      lv
      |> element("button", "New Workspace")
      |> render_click()

      lv
      |> form("form[phx-submit='create_workspace']", %{
        "name" => "Acme Org",
        "slug" => "acme-org"
      })
      |> render_submit()

      html = render(lv)
      assert html =~ "Acme Org"
      assert html =~ "acme-org"
    end

    test "adds an existing member directly to the workspace", %{conn: conn} do
      owner = user_fixture()
      colleague = user_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(owner)
        |> live(~p"/workspaces")

      lv
      |> element("button", "Invite / Add Member")
      |> render_click()

      lv
      |> form("form[phx-submit='add_member']", %{
        "identifier" => colleague.email,
        "role" => "editor"
      })
      |> render_submit()

      html = render(lv)
      assert html =~ colleague.username
      assert html =~ colleague.email
    end

    test "generates workspace invitation link for non-registered email", %{conn: conn} do
      owner = user_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(owner)
        |> live(~p"/workspaces")

      lv
      |> element("button", "Invite / Add Member")
      |> render_click()

      lv
      |> form("form[phx-submit='add_member']", %{
        "identifier" => "newguy@company.com",
        "role" => "editor"
      })
      |> render_submit()

      html = render(lv)
      assert html =~ "Workspace Invitation Link"
      assert html =~ "/users/register/"
    end

    test "generates generic shareable invitation link when identifier is left empty", %{
      conn: conn
    } do
      owner = user_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(owner)
        |> live(~p"/workspaces")

      lv
      |> element("button", "Invite / Add Member")
      |> render_click()

      lv
      |> form("form[phx-submit='add_member']", %{
        "identifier" => "",
        "role" => "viewer"
      })
      |> render_submit()

      html = render(lv)
      assert html =~ "Workspace Invitation Link"
      assert html =~ "/users/register/"
    end
  end
end
