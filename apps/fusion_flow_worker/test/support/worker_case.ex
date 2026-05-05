defmodule FusionFlowWorker.WorkerCase do
  @moduledoc """
  Test case for FusionFlowWorker tests.

  Sets up the Ecto SQL sandbox (via FusionFlowCore.DataCase) and configures
  Oban for manual testing mode so that jobs are not automatically drained.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      use Oban.Testing, repo: FusionFlowCore.Repo

      alias FusionFlowCore.Executions
      alias FusionFlowCore.Flows
      alias FusionFlowWorker.FlowExecutionWorker

      import FusionFlowWorker.WorkerCase
    end
  end

  setup tags do
    FusionFlowCore.DataCase.setup_sandbox(tags)
    :ok
  end
end
