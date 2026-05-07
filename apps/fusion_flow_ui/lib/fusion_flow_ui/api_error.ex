defmodule FusionFlowUI.ApiError do
  @moduledoc false

  def format(code, message, details \\ nil) do
    error =
      %{code: to_string(code), message: message}
      |> maybe_put_details(details)

    %{error: error}
  end

  defp maybe_put_details(error, nil), do: error
  defp maybe_put_details(error, details), do: Map.put(error, :details, details)
end
