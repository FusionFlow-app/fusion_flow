defmodule FusionFlowWeb.PageController do
  use FusionFlowWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end
