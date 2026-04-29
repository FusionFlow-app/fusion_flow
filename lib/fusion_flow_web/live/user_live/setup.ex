defmodule FusionFlowWeb.UserLive.Setup do
  use FusionFlowWeb, :live_view

  alias FusionFlow.Accounts

  @impl true
  def mount(_params, _session, socket) do
    if Accounts.has_system_admin?() do
      {:ok,
       socket
       |> put_flash(:info, gettext("Setup already completed. Please log in."))
       |> redirect(to: ~p"/users/log-in")}
    else
      form =
        %FusionFlow.Accounts.User{}
        |> FusionFlow.Accounts.User.registration_changeset(%{})
        |> FusionFlow.Accounts.User.password_changeset(%{})
        |> to_form(as: "user")

      {:ok,
       socket
       |> assign(:page_title, gettext("Setup"))
       |> assign(:form, form)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {gettext("Setup FusionFlow")}
          </h1>

          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {gettext("Create the first administrator account to get started.")}
          </p>
        </div>

        <div
          id="setup-liveview-required"
          role="alert"
          phx-connected={JS.hide()}
          phx-disconnected={JS.show()}
          class="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
        >
          <div class="flex gap-3">
            <.icon name="hero-exclamation-triangle" class="mt-0.5 size-5 shrink-0" />
            <p>
              {gettext(
                "LiveView is not connected yet. Check that JavaScript is enabled and that assets loaded correctly before creating the account."
              )}
            </p>
          </div>
        </div>

        <.form for={@form} id="setup_form" phx-submit="save" class="space-y-5">
          <.input
            field={@form[:username]}
            type="text"
            label={gettext("Username")}
            placeholder={gettext("Enter your username")}
            required
            phx-mounted={JS.focus()}
          />
          <.input
            field={@form[:email]}
            type="email"
            label={gettext("Email")}
            placeholder={gettext("Enter your email")}
            required
          />
          <.input
            field={@form[:password]}
            type="password"
            label={gettext("Password")}
            placeholder="••••••••"
            required
          />
          <.input
            field={@form[:password_confirmation]}
            type="password"
            label={gettext("Confirm password")}
            placeholder="••••••••"
            required
          />
          <div class="pt-2">
            <.button
              id="setup-submit-button"
              type="submit"
              variant="primary"
              disabled
              phx-connected={JS.remove_attribute("disabled")}
              phx-disconnected={JS.set_attribute({"disabled", ""})}
              class="w-full py-4 text-base font-bold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              {gettext("Create account")}
            </.button>
          </div>
        </.form>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("save", %{"user" => user_params}, socket) do
    case Accounts.register_system_admin(user_params) do
      {:ok, _user} ->
        {:noreply,
         socket
         |> put_flash(:info, gettext("Account created successfully. You can now log in."))
         |> redirect(to: ~p"/users/log-in")}

      {:error, %Ecto.Changeset{} = changeset} ->
        form =
          changeset
          |> to_form(as: "user")

        {:noreply,
         socket
         |> assign(:form, form)}
    end
  end
end
