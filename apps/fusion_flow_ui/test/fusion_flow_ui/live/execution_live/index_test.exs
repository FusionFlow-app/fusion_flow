defmodule FusionFlowUI.ExecutionLive.IndexTest do
  use FusionFlowUI.ConnCase, async: true

  import Phoenix.LiveViewTest
  import FusionFlowCore.AccountsFixtures
  import FusionFlowCore.FlowsFixtures

  alias FusionFlowCore.Executions

  setup %{conn: conn} do
    admin = system_admin_fixture()
    Process.put(:fusion_flow_owner, admin)
    %{conn: log_in_user(conn, admin), user: admin}
  end

  describe "mount" do
    test "requires authentication" do
      conn = Phoenix.ConnTest.build_conn()

      assert {:error, redirect} = live(conn, ~p"/executions")
      assert {:redirect, %{to: path}} = redirect
      assert path == ~p"/users/log-in"
    end

    test "allows authenticated regular users to view their executions" do
      user = user_fixture()

      conn =
        Phoenix.ConnTest.build_conn()
        |> Phoenix.ConnTest.init_test_session(%{})
        |> log_in_user(user)

      assert {:ok, _lv, html} = live(conn, ~p"/executions")
      assert html =~ "Executions"
    end
  end

  describe "index" do
    test "lists executions with status and flow name", %{conn: conn} do
      flow = flow_fixture(%{name: "Billing Flow"})
      execution = execution_fixture(%{flow: flow})

      {:ok, lv, html} = live(conn, ~p"/executions")

      assert html =~ "Executions"
      assert html =~ "Billing Flow"
      assert html =~ "queued"
      assert html =~ execution.public_id
      assert has_element?(lv, "#execution-row-#{execution.public_id}")
    end

    test "shows an empty state", %{conn: conn} do
      {:ok, lv, _html} = live(conn, ~p"/executions")

      assert has_element?(lv, "#executions-empty")
    end
  end

  describe "show" do
    test "shows execution details", %{conn: conn} do
      flow = flow_fixture(%{name: "Report Flow"})
      execution = execution_fixture(%{flow: flow, input: %{"trigger" => "manual"}})
      {:ok, execution} = Executions.mark_running(execution)

      {:ok, execution} =
        Executions.mark_succeeded(execution, %{"ok" => true}, %{
          logs: [%{"node_id" => "1", "status" => "success"}]
        })

      {:ok, lv, html} = live(conn, ~p"/executions/#{execution.public_id}")

      assert html =~ "Report Flow"
      assert html =~ execution.public_id
      assert html =~ "succeeded"
      assert html =~ "manual"
      assert html =~ "node_id"
      assert has_element?(lv, "#execution-detail")
      assert has_element?(lv, "a[href=\"/flows/#{flow.id}\"]", "Open Flow")
    end
  end
end
