defmodule FusionFlowUI.PublicAPI.V1.Routes do
  @moduledoc false

  defmacro public_api_pipelines do
    quote do
      pipeline :public_api do
        plug :accepts, ["json"]
      end

      pipeline :public_api_authenticated do
        plug FusionFlowUI.Plugs.ApiKeyAuth
      end
    end
  end

  defmacro public_api_routes do
    quote do
      scope "/api/v1", FusionFlowUI.PublicAPI.V1 do
        pipe_through [:public_api]

        get "/health", HealthController, :show
      end

      scope "/api/v1", FusionFlowUI.PublicAPI.V1 do
        pipe_through [:public_api, :public_api_authenticated]

        get "/nodes", NodeController, :index
        get "/nodes/:type", NodeController, :show

        get "/workflows/:workflow_id/executions", ExecutionController, :index
        get "/workflows/:workflow_id/executions/:public_id", ExecutionController, :show

        post "/workflows/:workflow_id/executions", ExecutionController, :create

        get "/workflows", WorkflowController, :index
        get "/workflows/:id", WorkflowController, :show

        post "/workflows", WorkflowController, :create
        put "/workflows/:id", WorkflowController, :update
        patch "/workflows/:id", WorkflowController, :update

        delete "/workflows/:id", WorkflowController, :delete
      end
    end
  end
end
