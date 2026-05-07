defmodule FusionFlowUI.DashboardLiveTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures
  import FusionFlowCore.FlowsFixtures

  describe "mount" do
    test "requires authentication", %{conn: conn} do
      assert {:error, redirect} = live(conn, ~p"/")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "renders dashboard with flows for system admin", %{conn: conn} do
      admin = system_admin_fixture()
      flow_fixture(%{name: "Test Flow", user_id: admin.id})

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/")

      assert html =~ "Dashboard"
      assert html =~ "Test Flow"
      assert html =~ "Total Workflows"
      assert html =~ "Manage Flows"
    end

    test "shows restricted message and no flows for non-admin", %{conn: conn} do
      user = user_fixture()

      {:ok, _lv, html} =
        conn
        |> log_in_user(user)
        |> live(~p"/")

      assert html =~ "Dashboard"
      assert html =~ "Contact an administrator"
      refute html =~ "Total Workflows"
      refute html =~ "Manage Flows"
      refute html =~ "Recent Workflows"
    end

    test "shows empty state when no flows for admin", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/")

      assert html =~ "No flows"
      assert html =~ "Create Flow"
    end

    test "displays flow count for admin", %{conn: conn} do
      admin = system_admin_fixture()
      flow_fixture(%{name: "Flow 1", user_id: admin.id})
      flow_fixture(%{name: "Flow 2", user_id: admin.id})

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/")

      assert html =~ "2"
    end

    test "handles change_locale event", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/")

      {:ok, conn} =
        lv
        |> form("#locale-form")
        |> render_change(%{locale: "pt_BR"})
        |> follow_redirect(conn, ~p"/?locale=pt_BR")

      assert conn.assigns.locale == "pt_BR"
    end
  end
end
