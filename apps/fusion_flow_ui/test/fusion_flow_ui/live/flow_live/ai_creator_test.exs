defmodule FusionFlowUI.FlowLive.AICreatorTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures

  describe "mount" do
    test "requires authentication", %{conn: conn} do
      assert {:error, redirect} = live(conn, ~p"/flows/new/ai")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "redirects to /flows when openai is not configured", %{conn: conn} do
      user = user_fixture()

      assert {:error, {:live_redirect, %{to: path}}} =
               conn
               |> log_in_user(user)
               |> live(~p"/flows/new/ai")

      assert path == ~p"/flows"
    end
  end
end
