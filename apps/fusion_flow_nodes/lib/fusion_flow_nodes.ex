defmodule FusionFlowNodes do
  @moduledoc """
  FusionKit manifest for the built-in FusionFlow nodes.
  """

  use FusionKit.Manifest

  alias FusionFlowNodes.Nodes.{
    Condition,
    Eval,
    HttpRequest,
    Logger,
    Output,
    Start,
    Variable,
    Webhook
  }

  manifest do
    nodes([
      Start,
      Webhook,
      Variable,
      Eval,
      HttpRequest,
      Condition,
      Logger,
      Output
    ])
  end
end
