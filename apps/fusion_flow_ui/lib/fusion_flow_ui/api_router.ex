defmodule FusionFlowUI.ApiRouter do
  use FusionFlowUI, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", FusionFlowUI do
    pipe_through :api

    get "/flows/:flow_id/executions/:public_id", ExecutionController, :show
    resources "/flows", FlowController, except: [:new, :edit]
  end

  scope "/", FusionFlowUI do
    pipe_through :api

    match :*, "/*path", ApiNotFoundController, :show
  end
end
