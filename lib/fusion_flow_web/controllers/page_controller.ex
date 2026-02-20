defmodule FusionFlowWeb.PageController do
  use FusionFlowWeb, :controller

  def redirect_to_flows(conn, _params) do
    redirect(conn, to: ~p"/flows")
  end
end
