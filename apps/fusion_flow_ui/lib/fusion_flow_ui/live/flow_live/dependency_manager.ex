defmodule FusionFlowUI.FlowLive.DependencyManager do
  @moduledoc """
  Socket reducers for the Hex dependency installer used inside `FlowLive`.

  Keeps the dependency search/install concern (and its terminal-log /
  restart-detection bookkeeping) out of the LiveView. `FlowLive` delegates its
  `dependencies`/`dep_*` events here; each function takes and returns the socket.
  """
  import Phoenix.Component, only: [assign: 2]
  import Phoenix.LiveView, only: [put_flash: 3]

  alias FusionFlowCore.Dependencies

  @restart_markers [
    "You must restart your server",
    "could not compile application",
    "failure",
    "must be recomputed",
    "server restart"
  ]

  @doc "Default dependency-related assigns, merged into the LiveView mount."
  def initial_assigns do
    [
      dependencies_modal_open: false,
      dependencies_tab: "elixir",
      search_query: "",
      search_results: [],
      installed_deps: [],
      terminal_logs: [],
      pending_restart_deps: [],
      installing_dep: nil
    ]
  end

  def open(socket) do
    assign(socket,
      dependencies_modal_open: true,
      installed_deps: Dependencies.list_installed_mix_deps()
    )
  end

  def close(socket) do
    assign(socket, dependencies_modal_open: false, search_results: [], search_query: "")
  end

  def switch_tab(socket, tab) do
    assign(socket, dependencies_tab: tab)
  end

  def search(socket, query) do
    if String.length(query) < 2 do
      assign(socket, search_query: query, search_results: [])
    else
      results =
        case Dependencies.search_hex(query) do
          {:ok, results} -> results
          _ -> []
        end

      assign(socket, search_query: query, search_results: results)
    end
  end

  def install(socket, name, version) do
    target = self()

    Task.start(fn ->
      case Dependencies.add_dependency(name, version, "elixir", stream_to: target) do
        {:ok, _} -> send(target, {:dep_install_finished, name})
        {:error, reason} -> send(target, {:dep_install_failed, name, reason})
      end
    end)

    assign(socket,
      terminal_logs: ["Starting installation of #{name}...\n"],
      installing_dep: name
    )
  end

  def log(socket, message) do
    logs = socket.assigns.terminal_logs ++ [message]
    pending = socket.assigns.pending_restart_deps

    new_pending =
      if restart_needed?(logs) and socket.assigns.installing_dep do
        Enum.uniq([socket.assigns.installing_dep | pending])
      else
        pending
      end

    assign(socket, terminal_logs: logs, pending_restart_deps: new_pending)
  end

  def install_finished(socket, name) do
    {type, msg} =
      if name in socket.assigns.pending_restart_deps do
        {:warning, "Dependency #{name} installed, but a server restart is required."}
      else
        {:info, "Dependency #{name} installed successfully!"}
      end

    socket
    |> put_flash(type, msg)
    |> assign(installed_deps: Dependencies.list_installed_mix_deps(), installing_dep: nil)
  end

  def install_failed(socket, name, reason) do
    socket
    |> put_flash(:error, "Failed to install #{name}: #{inspect(reason)}")
    |> assign(installing_dep: nil)
  end

  defp restart_needed?(logs) do
    joined = Enum.join(logs)
    Enum.any?(@restart_markers, &String.contains?(joined, &1))
  end
end
