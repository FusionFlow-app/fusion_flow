defmodule FusionFlowUI.FallbackController do
  use FusionFlowUI, :controller

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: FusionFlowUI.ErrorJSON)
    |> render(:"404")
  end

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: FusionFlowUI.ChangesetJSON)
    |> render("error.json", changeset: changeset)
  end
end
