defmodule FusionFlowRuntime.Runtime.Executor do
  @moduledoc """
  Defines the behaviour for language executors in FusionFlowCore.
  """

  @callback language() :: String.t()
  @callback execute(code :: String.t(), context :: map()) ::
              {:ok, map()} | {:result, any()} | {:error, any()}
end
