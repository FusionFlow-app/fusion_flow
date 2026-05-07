defmodule FusionFlowUI.ChangesetJSON do
  alias FusionFlowUI.ApiError

  @doc """
  Renders changeset errors.
  """
  def error(%{changeset: changeset}) do
    ApiError.format(
      :validation_error,
      "Validation failed",
      Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
    )
  end

  defp translate_error({msg, opts}) do
    # You can make use of gettext to translate error messages by
    # uncommenting and adjusting the following code:

    # if count = opts[:count] do
    #   Gettext.dgettext(FusionFlowUI.Gettext, "errors", msg, count: count)
    # else
    #   Gettext.dgettext(FusionFlowUI.Gettext, "errors", msg, opts)
    # end

    Enum.reduce(opts, msg, fn {key, value}, acc ->
      String.replace(acc, "%{#{key}}", fn _ -> to_string(value) end)
    end)
  end
end
