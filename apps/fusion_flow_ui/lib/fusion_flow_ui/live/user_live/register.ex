defmodule FusionFlowUI.UserLive.Register do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.Accounts
  alias FusionFlowCore.Accounts.Invite

  @impl true
  def mount(%{"token" => token}, _session, socket) do
    invite = Accounts.get_invite_by_token(token)

    cond do
      is_nil(invite) ->
        {:ok,
         socket
         |> put_flash(:error, gettext("Invalid invite link."))
         |> redirect(to: ~p"/users/log-in")}

      Invite.used?(invite) ->
        {:ok,
         socket
         |> put_flash(:error, gettext("This invite has already been used."))
         |> redirect(to: ~p"/users/log-in")}

      Invite.expired?(invite) ->
        {:ok,
         socket
         |> put_flash(:error, gettext("This invite has expired."))
         |> redirect(to: ~p"/users/log-in")}

      true ->
        form =
          %Accounts.User{}
          |> Accounts.User.registration_changeset(%{})
          |> Accounts.User.password_changeset(%{})
          |> to_form(as: "user")

        {:ok,
         socket
         |> assign(:page_title, gettext("Create account"))
         |> assign(:form, form)
         |> assign(:invite, invite)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700/50">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {gettext("Create your account")}
          </h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {gettext("You were invited to FusionFlowCore. Complete the form below.")}
          </p>
        </div>

        <.form
          for={@form}
          id="register_form"
          phx-submit="save"
          class="space-y-5"
        >
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
              type="submit"
              variant="primary"
              class="w-full py-4 text-base font-bold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 active:scale-[0.98]"
            >
              {gettext("Create account")}
            </.button>
          </div>
        </.form>

        <p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <.link navigate={~p"/users/log-in"} class="text-primary hover:underline">
            {gettext("Back to log in")}
          </.link>
        </p>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("save", %{"user" => user_params}, socket) do
    invite = socket.assigns.invite

    case Accounts.register_user_with_invite(user_params, invite) do
      {:ok, _user} ->
        {:noreply,
         socket
         |> put_flash(:info, gettext("Account created successfully. You can now log in."))
         |> redirect(to: ~p"/users/log-in")}

      {:error, :invite_mark_failed} ->
        {:noreply,
         socket
         |> put_flash(
           :error,
           gettext("Account was not created. Please try again or contact support.")
         )
         |> redirect(to: ~p"/users/register/#{invite.token}")}

      {:error, %Ecto.Changeset{} = changeset} ->
        form = to_form(changeset, as: "user")

        {:noreply,
         socket
         |> assign(:form, form)}
    end
  end
end
