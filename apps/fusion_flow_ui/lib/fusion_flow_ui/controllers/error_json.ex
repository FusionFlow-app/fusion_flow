defmodule FusionFlowUI.ErrorJSON do
  alias FusionFlowUI.ApiError

  @moduledoc """
  This module is invoked by your endpoint in case of errors on JSON requests.

  See config/config.exs.
  """

  # If you want to customize a particular status code,
  # you may add your own clauses, such as:
  #
  # def render("500.json", _assigns) do
  #   %{errors: %{detail: "Internal Server Error"}}
  # end

  # By default, Phoenix returns the status message from
  # the template name. For example, "404.json" becomes
  # "Not Found".
  def render(template, _assigns) do
    ApiError.format(
      code_from_template(template),
      Phoenix.Controller.status_message_from_template(template)
    )
  end

  defp code_from_template("401.json"), do: :unauthorized
  defp code_from_template("403.json"), do: :forbidden
  defp code_from_template("404.json"), do: :not_found
  defp code_from_template("429.json"), do: :rate_limited
  defp code_from_template("500.json"), do: :internal_server_error
  defp code_from_template(template), do: String.replace_suffix(template, ".json", "")
end
