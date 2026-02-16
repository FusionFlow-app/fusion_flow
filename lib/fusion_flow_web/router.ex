defmodule FusionFlowWeb.Router do
  use FusionFlowWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {FusionFlowWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", FusionFlowWeb do
    pipe_through :browser

    get "/", PageController, :home
    live "/flows", FlowListLive
    live "/flows/:id", FlowLive
  end

  # JSON API Scope
  scope "/api", FusionFlowWeb do
    pipe_through :api

    resources "/flows", FlowController, except: [:new, :edit]
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:fusion_flow, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: FusionFlowWeb.Telemetry
    end
  end
end
