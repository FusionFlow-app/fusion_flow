defmodule FusionFlowUI.FlowLive.DependencyManagerTest do
  use ExUnit.Case, async: true

  import Phoenix.Component, only: [assign: 2]

  alias FusionFlowUI.FlowLive.DependencyManager

  defp socket(assigns), do: assign(%Phoenix.LiveView.Socket{}, assigns)

  describe "log/2" do
    test "flags the installing dep for restart when a restart marker appears" do
      result =
        [terminal_logs: [], pending_restart_deps: [], installing_dep: "jason"]
        |> socket()
        |> DependencyManager.log("You must restart your server\n")

      assert result.assigns.terminal_logs == ["You must restart your server\n"]
      assert result.assigns.pending_restart_deps == ["jason"]
    end

    test "does not flag a restart for ordinary log lines" do
      result =
        [terminal_logs: ["compiling...\n"], pending_restart_deps: [], installing_dep: "jason"]
        |> socket()
        |> DependencyManager.log("ok\n")

      assert result.assigns.terminal_logs == ["compiling...\n", "ok\n"]
      assert result.assigns.pending_restart_deps == []
    end

    test "does not duplicate a dep already pending restart" do
      result =
        [terminal_logs: [], pending_restart_deps: ["jason"], installing_dep: "jason"]
        |> socket()
        |> DependencyManager.log("server restart\n")

      assert result.assigns.pending_restart_deps == ["jason"]
    end

    test "does not flag when no dep is currently installing" do
      result =
        [terminal_logs: [], pending_restart_deps: [], installing_dep: nil]
        |> socket()
        |> DependencyManager.log("You must restart your server\n")

      assert result.assigns.pending_restart_deps == []
    end
  end

  describe "switch_tab/2 and close/1" do
    test "switch_tab sets the active tab" do
      result =
        [dependencies_tab: "elixir"]
        |> socket()
        |> DependencyManager.switch_tab("python")

      assert result.assigns.dependencies_tab == "python"
    end

    test "close resets the modal and search state" do
      result =
        [dependencies_modal_open: true, search_results: [1, 2], search_query: "ex"]
        |> socket()
        |> DependencyManager.close()

      assert result.assigns.dependencies_modal_open == false
      assert result.assigns.search_results == []
      assert result.assigns.search_query == ""
    end
  end

  describe "initial_assigns/0" do
    test "provides the dependency defaults" do
      assigns = DependencyManager.initial_assigns()

      assert assigns[:dependencies_modal_open] == false
      assert assigns[:dependencies_tab] == "elixir"
      assert assigns[:installing_dep] == nil
      assert assigns[:pending_restart_deps] == []
    end
  end
end
