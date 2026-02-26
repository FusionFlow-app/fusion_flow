defmodule FusionFlowWeb.FlowListLiveTest do
  use FusionFlowWeb.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlow.FlowsFixtures
  import FusionFlow.AccountsFixtures

  describe "mount" do
    test "requires authentication", %{conn: conn} do
      assert {:error, redirect} = live(conn, ~p"/flows")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "redirects non-admin to root", %{conn: conn} do
      user = user_fixture()
      assert {:error, {:redirect, %{to: path}}} =
               conn
               |> log_in_user(user)
               |> live(~p"/flows")

      assert path == ~p"/"
    end

    test "renders flow list for system admin", %{conn: conn} do
      admin = system_admin_fixture()
      flow_fixture(%{name: "My Flow"})

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/flows")

      assert html =~ "My Flow"
      assert html =~ "My Flows"
    end

    test "shows empty state when no flows", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/flows")

      assert html =~ "No flows created yet"
      assert html =~ "Get started"
    end

    test "displays flow count", %{conn: conn} do
      admin = system_admin_fixture()
      flow_fixture(%{name: "Flow 1"})
      flow_fixture(%{name: "Flow 2"})
      flow_fixture(%{name: "Flow 3"})

      {:ok, _lv, html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/flows")

      assert html =~ "3 Flows available"
    end
  end

  describe "create_flow" do
    test "creates a new flow when button is clicked", %{conn: conn} do
      admin = system_admin_fixture()

      {:ok, lv, _html} =
        conn
        |> log_in_user(admin)
        |> live(~p"/flows")

      lv
      |> element("button", "New Flow")
      |> render_click()
    end
  end
end
