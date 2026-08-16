defmodule FusionFlowUI.Router do
  use FusionFlowUI, :router

  import FusionFlowUI.UserAuth
  require FusionFlowUI.PublicAPI.V1.Routes

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {FusionFlowUI.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_scope_for_user
    plug :redirect_to_setup_if_no_admin
    plug FusionFlowUI.Plugs.SetLocale
  end

  FusionFlowUI.PublicAPI.V1.Routes.public_api_pipelines()

  pipeline :redirect_if_authenticated do
    plug :redirect_if_user_is_authenticated
  end

  FusionFlowUI.PublicAPI.V1.Routes.public_api_routes()

  # Enable LiveDashboard in development
  if Application.compile_env(:fusion_flow_ui, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: FusionFlowUI.Telemetry
    end
  end

  ## Authentication routes

  scope "/", FusionFlowUI do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [
        {FusionFlowUI.UserAuth, :require_authenticated},
        {FusionFlowUI.WorkspaceAuth, :mount_workspace_scope}
      ] do
      live "/users/settings", UserLive.Settings, :edit
      live "/", DashboardLive.Index
      live "/workspaces", WorkspaceLive.Index
      live "/flows", FlowLive.Index
      live "/flows/new/ai", FlowLive.AICreator
      live "/flows/:id", FlowLive.Editor
      live "/executions", ExecutionLive.Index, :index
      live "/executions/:public_id", ExecutionLive.Index, :show
    end

    live_session :require_system_admin,
      on_mount: [
        {FusionFlowUI.UserAuth, :require_authenticated},
        {FusionFlowUI.WorkspaceAuth, :mount_workspace_scope},
        {FusionFlowUI.UserAuth, :require_system_admin}
      ] do
      live "/users", UserLive.Index, :index
      live "/api-keys", ApiKeyLive.Index
    end

    get "/workspaces/switch/:id", WorkspaceSessionController, :switch
    post "/users/update-password", UserSessionController, :update_password
  end

  scope "/", FusionFlowUI do
    pipe_through [:browser, :redirect_if_authenticated]

    live_session :current_user,
      on_mount: [{FusionFlowUI.UserAuth, :mount_current_scope}] do
      live "/setup", UserLive.Setup, :new
      live "/users/log-in", UserLive.Login, :new
      live "/users/register/:token", UserLive.Register, :new
    end

    post "/users/log-in", UserSessionController, :create
  end

  scope "/", FusionFlowUI do
    pipe_through [:browser]

    delete "/users/log-out", UserSessionController, :delete
  end
end
