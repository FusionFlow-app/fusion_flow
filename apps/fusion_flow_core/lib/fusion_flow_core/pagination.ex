defmodule FusionFlowCore.Pagination do
  @moduledoc false

  import Ecto.Query, only: [limit: 2, offset: 2]

  @default_page 1
  @default_per_page 20

  def paginate(query, repo, opts) do
    page = Map.get(opts, :page, @default_page)
    per_page = Map.get(opts, :per_page, @default_per_page)
    total = repo.aggregate(query, :count)
    total_pages = if total == 0, do: 1, else: div(total + per_page - 1, per_page)
    offset_value = (page - 1) * per_page

    entries =
      query
      |> limit(^per_page)
      |> offset(^offset_value)
      |> repo.all()

    %{
      entries: entries,
      page: page,
      per_page: per_page,
      total: total,
      total_pages: total_pages
    }
  end

  def paginate(entries, opts) when is_list(entries) do
    page = Map.get(opts, :page, @default_page)
    per_page = Map.get(opts, :per_page, @default_per_page)
    total = length(entries)
    total_pages = if total == 0, do: 1, else: div(total + per_page - 1, per_page)
    offset_value = (page - 1) * per_page

    %{
      entries: Enum.slice(entries, offset_value, per_page),
      page: page,
      per_page: per_page,
      total: total,
      total_pages: total_pages
    }
  end
end
