defmodule FusionFlowWeb.FlowAiCreatorLiveTest do
  use FusionFlowWeb.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlow.AccountsFixtures

  describe "mount" do
    test "requires authentication", %{conn: conn} do
      assert {:error, redirect} = live(conn, ~p"/flows/new/ai")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "redirects non-admin to root", %{conn: conn} do
      user = user_fixture()
      assert {:error, {:redirect, %{to: path}}} =
               conn
               |> log_in_user(user)
               |> live(~p"/flows/new/ai")

      assert path == ~p"/"
    end
  end
end
