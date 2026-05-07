defmodule FusionFlowUI.PublicAPI.NodeJSON do
  def index(%{nodes: nodes, meta: meta}) do
    %{data: nodes, meta: meta}
  end

  def show(%{node: node}) do
    %{data: node}
  end
end
