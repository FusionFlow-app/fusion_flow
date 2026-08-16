defmodule FusionFlowUI.WorkspaceSessionControllerTest do
  use FusionFlowUI.ConnCase, async: true

  import FusionFlowCore.AccountsFixtures
  alias FusionFlowCore.Workspaces

  describe "GET /workspaces/switch/:id" do
    test "switches active workspace in session and redirects", %{conn: conn} do
      user = user_fixture()
      {:ok, %{workspace: _ws1}} = Workspaces.ensure_default_workspace(user)

      {:ok, %{workspace: ws2}} =
        Workspaces.create_workspace(user, %{name: "Second Org", slug: "second-org"})

      conn =
        conn
        |> log_in_user(user)
        |> get(~p"/workspaces/switch/#{ws2.id}")

      assert redirected_to(conn) == "/"
      assert get_session(conn, :current_workspace_id) == ws2.id
    end

    test "denies switching to workspace user is not a member of", %{conn: conn} do
      user1 = user_fixture()
      user2 = user_fixture()

      {:ok, %{workspace: secret_ws}} =
        Workspaces.create_workspace(user2, %{name: "Secret Org", slug: "secret-org"})

      conn =
        conn
        |> log_in_user(user1)
        |> get(~p"/workspaces/switch/#{secret_ws.id}")

      assert redirected_to(conn) == "/"
      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~ "Access denied"
    end
  end
end
