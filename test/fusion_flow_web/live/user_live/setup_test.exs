defmodule FusionFlowWeb.UserLive.SetupTest do
  use FusionFlowWeb.ConnCase, async: false

  import Phoenix.LiveViewTest

  alias FusionFlow.Accounts.Invite
  alias FusionFlow.Accounts.User
  alias FusionFlow.Accounts.UserToken
  alias FusionFlow.Repo

  setup do
    Repo.delete_all(Invite)
    Repo.delete_all(UserToken)
    Repo.delete_all(User)

    :ok
  end

  describe "mount /setup" do
    test "shows a LiveView connection warning and keeps submit disabled until connected", %{
      conn: conn
    } do
      {:ok, view, _html} = live(conn, ~p"/setup")

      assert has_element?(view, "#setup-liveview-required[role='alert']")
      assert has_element?(view, "#setup-submit-button[disabled]")
    end
  end
end
