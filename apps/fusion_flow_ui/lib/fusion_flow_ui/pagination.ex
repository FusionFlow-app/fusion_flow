defmodule FusionFlowUI.Pagination do
  @moduledoc false

  @default_page 1
  @default_per_page 20
  @max_per_page 100

  def from_params(params) do
    page = params |> Map.get("page") |> parse_positive_int(@default_page)

    per_page =
      params
      |> Map.get("per_page")
      |> parse_positive_int(@default_per_page)
      |> min(@max_per_page)

    %{page: page, per_page: per_page}
  end

  defp parse_positive_int(nil, default), do: default

  defp parse_positive_int(value, default) when is_integer(value) do
    if value > 0, do: value, else: default
  end

  defp parse_positive_int(value, default) when is_binary(value) do
    case Integer.parse(value) do
      {int, ""} when int > 0 -> int
      _ -> default
    end
  end

  defp parse_positive_int(_value, default), do: default
end
