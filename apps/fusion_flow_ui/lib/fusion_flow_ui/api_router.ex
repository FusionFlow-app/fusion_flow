defmodule FusionFlowUI.ApiRouter do
  use FusionFlowUI, :router

  require FusionFlowUI.PublicAPI.V1.Routes

  FusionFlowUI.PublicAPI.V1.Routes.public_api_pipelines()
  FusionFlowUI.PublicAPI.V1.Routes.public_api_routes()

  scope "/", FusionFlowUI do
    pipe_through :public_api

    match :*, "/*path", ApiNotFoundController, :show
  end
end
