defmodule FusionFlowUI.ApiKeyLive do
  use FusionFlowUI, :live_view

  alias FusionFlowCore.ApiKeys
  alias FusionFlowCore.ApiKeys.ApiKey

  @expiration_options [
    {"Never expires", "never"},
    {"30 days", "30"},
    {"90 days", "90"},
    {"1 year", "365"}
  ]

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:page_title, gettext("API keys"))
     |> assign(:created_token, nil)
     |> assign(:form, api_key_form())
     |> assign(:scopes, ApiKey.scopes())
     |> assign(:expiration_options, @expiration_options)
     |> assign_api_keys()}
  end

  @impl true
  def handle_event("create", %{"api_key" => params}, socket) do
    user = socket.assigns.current_scope.user

    attrs = %{
      name: Map.get(params, "name"),
      scopes: Map.get(params, "scopes", []),
      expires_at: expires_at(Map.get(params, "expires_in", "never"))
    }

    case ApiKeys.create_api_key(user, attrs) do
      {:ok, %{token: token}} ->
        {:noreply,
         socket
         |> assign(:created_token, token)
         |> assign(:form, api_key_form())
         |> assign_api_keys()
         |> put_flash(:info, gettext("API key created. Copy it now; it will not be shown again."))}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, gettext("Could not create API key."))}
    end
  end

  def handle_event("revoke", %{"id" => id}, socket) do
    api_key = ApiKeys.get_api_key!(id)

    case ApiKeys.revoke_api_key(api_key) do
      {:ok, _api_key} ->
        {:noreply,
         socket
         |> assign(:created_token, nil)
         |> assign_api_keys()
         |> put_flash(:info, gettext("API key revoked."))}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, gettext("Could not revoke API key."))}
    end
  end

  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/api-keys?locale=#{locale}")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div class="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{gettext("API keys")}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {gettext("Create and revoke keys for authenticated public API access.")}
          </p>
        </div>
        <div class="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <.icon name="hero-shield-check" class="h-4 w-4" />
          {gettext("System admins only")}
        </div>
      </div>

      <div
        :if={@created_token}
        id="created-api-key-token"
        class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30"
      >
        <div class="flex items-start gap-3">
          <.icon name="hero-key" class="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-300" />
          <div class="min-w-0 flex-1">
            <h2 class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              {gettext("Copy this token now")}
            </h2>
            <p class="mt-1 text-sm text-emerald-800 dark:text-emerald-200">
              {gettext("For security, the full API key is only shown once.")}
            </p>
            <input
              id="created-token-value"
              type="text"
              readonly
              value={@created_token}
              class="mt-3 w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-gray-900 shadow-sm dark:border-emerald-900/60 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <section class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {gettext("Create key")}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {gettext("Choose only the scopes this integration needs.")}
            </p>
          </div>

          <.form for={@form} id="api-key-form" phx-submit="create" class="p-6 space-y-5">
            <.input
              field={@form[:name]}
              type="text"
              label={gettext("Name")}
              placeholder={gettext("Production deployer")}
              required
            />

            <.input
              field={@form[:expires_in]}
              type="select"
              label={gettext("Expiration")}
              options={@expiration_options}
            />

            <fieldset class="space-y-3">
              <legend class="text-sm font-medium text-gray-900 dark:text-white">
                {gettext("Scopes")}
              </legend>
              <div class="grid gap-2">
                <label
                  :for={scope <- @scopes}
                  class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30"
                >
                  <input
                    type="checkbox"
                    name="api_key[scopes][]"
                    value={scope}
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                  <span class="font-mono text-xs">{scope}</span>
                </label>
              </div>
            </fieldset>

            <.button type="submit" variant="primary" class="w-full">
              <.icon name="hero-plus" class="mr-2 h-4 w-4" />
              {gettext("Create API key")}
            </.button>
          </.form>
        </section>

        <section class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100 dark:border-slate-700/50">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {gettext("Existing keys")}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {length(@api_keys)} {gettext("keys")}
            </p>
          </div>

          <div id="api-keys-list" class="divide-y divide-gray-100 dark:divide-slate-700/70">
            <div
              :if={@api_keys == []}
              id="api-keys-empty"
              class="p-8 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              {gettext("No API keys yet.")}
            </div>

            <div :for={api_key <- @api_keys} id={"api-key-#{api_key.id}"} class="p-5">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="font-semibold text-gray-900 dark:text-white">{api_key.name}</h3>
                    <span class={[
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      status_class(api_key)
                    ]}>
                      {status_label(api_key)}
                    </span>
                  </div>

                  <dl class="mt-3 grid gap-2 text-sm text-gray-500 dark:text-gray-400 md:grid-cols-2">
                    <div>
                      <dt class="text-xs font-medium uppercase tracking-wide">{gettext("Prefix")}</dt>
                      <dd class="font-mono text-gray-900 dark:text-white">{api_key.prefix}</dd>
                    </div>
                    <div>
                      <dt class="text-xs font-medium uppercase tracking-wide">{gettext("Owner")}</dt>
                      <dd class="truncate text-gray-900 dark:text-white">{api_key.user.email}</dd>
                    </div>
                    <div>
                      <dt class="text-xs font-medium uppercase tracking-wide">
                        {gettext("Created")}
                      </dt>
                      <dd>{format_datetime(api_key.inserted_at)}</dd>
                    </div>
                    <div>
                      <dt class="text-xs font-medium uppercase tracking-wide">
                        {gettext("Last used")}
                      </dt>
                      <dd>{format_datetime(api_key.last_used_at)}</dd>
                    </div>
                    <div>
                      <dt class="text-xs font-medium uppercase tracking-wide">
                        {gettext("Expires")}
                      </dt>
                      <dd>{format_datetime(api_key.expires_at)}</dd>
                    </div>
                  </dl>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <span
                      :for={scope <- api_key.scopes}
                      class="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {scope}
                    </span>
                    <span
                      :if={api_key.scopes == []}
                      class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                    >
                      {gettext("No scopes")}
                    </span>
                  </div>
                </div>

                <.button
                  :if={!ApiKey.revoked?(api_key)}
                  type="button"
                  variant="danger"
                  phx-click="revoke"
                  phx-value-id={api_key.id}
                  data-confirm={gettext("Revoke this API key? This cannot be undone.")}
                >
                  <.icon name="hero-no-symbol" class="mr-2 h-4 w-4" />
                  {gettext("Revoke")}
                </.button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    """
  end

  defp assign_api_keys(socket) do
    assign(socket, :api_keys, ApiKeys.list_api_keys())
  end

  defp api_key_form do
    to_form(%{"name" => "", "expires_in" => "never", "scopes" => []}, as: :api_key)
  end

  defp expires_at("never"), do: nil

  defp expires_at(days) do
    case Integer.parse(days) do
      {days, _} when days > 0 -> DateTime.add(DateTime.utc_now(:second), days, :day)
      _ -> nil
    end
  end

  defp status_label(%ApiKey{} = api_key) do
    cond do
      ApiKey.revoked?(api_key) -> gettext("Revoked")
      ApiKey.expired?(api_key) -> gettext("Expired")
      true -> gettext("Active")
    end
  end

  defp status_class(%ApiKey{} = api_key) do
    cond do
      ApiKey.revoked?(api_key) ->
        "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"

      ApiKey.expired?(api_key) ->
        "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"

      true ->
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
    end
  end

  defp format_datetime(nil), do: gettext("Never")

  defp format_datetime(%DateTime{} = datetime) do
    Calendar.strftime(datetime, "%Y-%m-%d %H:%M")
  end
end
