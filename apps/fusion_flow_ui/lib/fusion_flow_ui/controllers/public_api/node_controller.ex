defmodule FusionFlowUI.PublicAPI.NodeController do
  use FusionFlowUI, :controller

  alias FusionFlowCore.Pagination, as: PaginationContract

  action_fallback FusionFlowUI.FallbackController

  plug FusionFlowUI.Plugs.RequireApiScope, ["nodes:read"]

  def index(conn, params) do
    nodes =
      FusionFlowNodes.available_nodes()
      |> Enum.map(&node_data/1)

    result =
      params
      |> FusionFlowUI.Pagination.from_params()
      |> then(&PaginationContract.paginate(nodes, &1))

    render(conn, :index, nodes: result.entries, meta: pagination_meta(result))
  end

  def show(conn, %{"type" => type}) do
    case find_node(type) do
      nil -> {:error, :not_found}
      module -> render(conn, :show, node: node_data(module))
    end
  end

  defp find_node(type) do
    FusionFlowNodes.available_nodes()
    |> Enum.find(fn module ->
      definition = module.definition()
      normalized_type = normalize_type(type)

      normalize_type(definition.name) == normalized_type or
        normalize_type(definition.title) == normalized_type
    end)
  end

  defp node_data(module) do
    definition = module.definition()

    %{
      type: definition.name,
      title: definition.title,
      description: Map.get(definition, :description),
      category: normalize_value(Map.get(definition, :category)),
      color: Map.get(definition, :color),
      icon: Map.get(definition, :icon),
      show: Map.get(definition, :show, true),
      inputs: definition |> Map.get(:inputs, []) |> normalize_value(),
      outputs: definition |> Map.get(:outputs, []) |> normalize_value(),
      ui_fields: definition |> Map.get(:ui_fields, []) |> normalize_value(),
      rete: module |> FusionKit.Node.to_rete() |> normalize_value()
    }
  end

  defp normalize_type(type) do
    type
    |> to_string()
    |> String.downcase()
    |> String.replace(~r/[^a-z0-9]+/, "-")
    |> String.trim("-")
  end

  defp normalize_value(value) when is_atom(value), do: Atom.to_string(value)
  defp normalize_value(value) when is_list(value), do: Enum.map(value, &normalize_value/1)

  defp normalize_value(%{} = value) do
    Map.new(value, fn {key, value} -> {normalize_value(key), normalize_value(value)} end)
  end

  defp normalize_value(value), do: value

  defp pagination_meta(result) do
    %{
      page: result.page,
      per_page: result.per_page,
      total: result.total,
      total_pages: result.total_pages
    }
  end
end
