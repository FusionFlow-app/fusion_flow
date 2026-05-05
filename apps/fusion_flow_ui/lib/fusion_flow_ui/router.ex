defmodule FusionFlowUI.Router do
  use FusionFlowUI, :router

  import FusionFlowUI.UserAuth

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

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :redirect_if_authenticated do
    plug :redirect_if_user_is_authenticated
  end

  # JSON API Scope
  scope "/api", FusionFlowUI do
    pipe_through :api

    get "/flows/:flow_id/executions/:public_id", ExecutionController, :show
    resources "/flows", FlowController, except: [:new, :edit]
  end

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
      on_mount: [{FusionFlowUI.UserAuth, :require_authenticated}] do
      live "/users/settings", UserLive.Settings, :edit
      live "/", DashboardLive
    end

    live_session :require_system_admin,
      on_mount: [
        {FusionFlowUI.UserAuth, :require_authenticated},
        {FusionFlowUI.UserAuth, :require_system_admin}
      ] do
      live "/users", UserLive.Index, :index
      live "/flows", FlowListLive
      live "/flows/new/ai", FlowAiCreatorLive
      live "/flows/:id", FlowLive
      live "/executions", ExecutionLive, :index
      live "/executions/:public_id", ExecutionLive, :show
    end

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
