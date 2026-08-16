defmodule FusionFlowUI.FlowLive.NodePaletteManager do
  @moduledoc """
  Socket reducers and helper functions for node sidebar, search, categorization,
  and quick-add modal in `FlowLive.Editor`.
  """

  import Phoenix.Component, only: [assign: 2]
  import Phoenix.LiveView, only: [push_event: 3]

  @max_recent_nodes 5

  @doc """
  Returns the default socket assigns for node search, categories, and creation modals.
  """
  def initial_assigns do
    [
      nodes_by_category: nodes_by_category(""),
      node_search_query: "",
      collapsed_node_categories: MapSet.new(),
      recent_nodes: [],
      available_nodes: FusionFlowNodes.Nodes.visible_nodes(),
      filtered_nodes: FusionFlowNodes.Nodes.visible_nodes(),
      node_modal_search_query: "",
      create_node_modal_open: false,
      selected_position: nil
    ]
  end

  @doc """
  Filters nodes in the sidebar by category and search query.
  """
  def filter_sidebar_nodes(socket, query) do
    assign(socket,
      node_search_query: query,
      nodes_by_category: nodes_by_category(query)
    )
  end

  @doc """
  Filters nodes displayed in the quick creation modal.
  """
  def filter_modal_nodes(socket, query) do
    assign(socket,
      filtered_nodes: filter_nodes(query),
      node_modal_search_query: query
    )
  end

  @doc """
  Toggles collapse/expanded state of a category in the sidebar.
  """
  def toggle_category(socket, category_param) do
    case category_from_param(category_param) do
      nil ->
        socket

      category ->
        collapsed = socket.assigns.collapsed_node_categories

        collapsed =
          if MapSet.member?(collapsed, category) do
            MapSet.delete(collapsed, category)
          else
            MapSet.put(collapsed, category)
          end

        assign(socket, collapsed_node_categories: collapsed)
    end
  end

  @doc """
  Opens the node creation modal at a specific canvas (x, y) coordinate.
  """
  def open_create_modal(socket, %{"x" => x, "y" => y}) do
    assign(socket,
      create_node_modal_open: true,
      selected_position: %{"x" => x, "y" => y}
    )
  end

  @doc """
  Closes the node creation modal.
  """
  def close_create_modal(socket) do
    assign(socket,
      create_node_modal_open: false,
      selected_position: nil,
      filtered_nodes: FusionFlowNodes.Nodes.visible_nodes(),
      node_modal_search_query: ""
    )
  end

  @doc """
  Creates a node selected from the quick modal and pushes `add_node` to Rete.js.
  """
  def create_node_from_modal(socket, name) do
    position = socket.assigns.selected_position || %{"x" => 100, "y" => 100}

    node_data = %{
      "id" => "node_#{:os.system_time(:millisecond)}_#{:rand.uniform(1000)}",
      "label" => name,
      "position" => position
    }

    socket
    |> assign(
      create_node_modal_open: false,
      selected_position: nil,
      filtered_nodes: FusionFlowNodes.Nodes.visible_nodes(),
      node_modal_search_query: ""
    )
    |> record_recent_node(name)
    |> push_event("add_node", %{
      name: name,
      definition: FusionFlowNodes.Nodes.get_node(name),
      data: node_data
    })
  end

  @doc """
  Adds a node directly by name and pushes `add_node` to Rete.js.
  """
  def add_node(socket, name) do
    definition = FusionFlowNodes.Nodes.get_node(name)

    socket
    |> record_recent_node(name)
    |> push_event("add_node", %{name: name, definition: definition})
  end

  @doc """
  Records a node as recently used.
  """
  def record_recent_node(socket, name) do
    case FusionFlowNodes.Nodes.get_node(name) do
      nil ->
        socket

      node ->
        recent_nodes =
          socket.assigns.recent_nodes
          |> Enum.reject(&(&1.name == name))
          |> then(&[node | &1])
          |> Enum.take(@max_recent_nodes)

        assign(socket, recent_nodes: recent_nodes)
    end
  end

  @doc """
  Filters all visible nodes matching a query string.
  """
  def filter_nodes(query) do
    all_nodes = FusionFlowNodes.Nodes.visible_nodes()
    normalized_query = String.trim(query || "")

    if normalized_query == "" do
      all_nodes
    else
      query_lower = String.downcase(normalized_query)

      Enum.filter(all_nodes, fn node ->
        name_match = String.contains?(String.downcase(node.name), query_lower)

        category_match =
          String.contains?(String.downcase(to_string(node.category)), query_lower)

        name_match || category_match
      end)
    end
  end

  @doc """
  Returns visible nodes grouped by category and sorted.
  """
  def nodes_by_category(query) do
    query
    |> filter_nodes()
    |> Enum.group_by(& &1.category)
    |> Enum.sort_by(fn {category, _nodes} -> category_sort_index(category) end)
  end

  defp category_sort_index(:trigger), do: 0
  defp category_sort_index(:flow_control), do: 1
  defp category_sort_index(:data_manipulation), do: 2
  defp category_sort_index(:code), do: 3
  defp category_sort_index(:integration), do: 4
  defp category_sort_index(:utility), do: 5
  defp category_sort_index(_), do: 6

  @doc """
  Finds matching category atom from string param.
  """
  def category_from_param(category) do
    FusionFlowNodes.Nodes.visible_nodes()
    |> Enum.map(& &1.category)
    |> Enum.uniq()
    |> Enum.find(&(to_string(&1) == category))
  end
end
