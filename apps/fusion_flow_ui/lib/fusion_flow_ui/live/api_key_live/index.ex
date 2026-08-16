defmodule FusionFlowUI.ApiKeyLive.Index do
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
    attrs = %{
      name: Map.get(params, "name"),
      scopes: Map.get(params, "scopes", []),
      expires_at: expires_at(Map.get(params, "expires_in", "never"))
    }

    case ApiKeys.create_api_key(socket.assigns.current_scope, attrs) do
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

    case ApiKeys.revoke_api_key(socket.assigns.current_scope, api_key) do
      {:ok, _api_key} ->
        {:noreply,
         socket
         |> assign(:created_token, nil)
         |> assign_api_keys()
         |> put_flash(:info, gettext("Revoked"))}

      {:error, _changeset} ->
        {:noreply, put_flash(socket, :error, gettext("Could not revoke API key."))}
    end
  end

  def handle_event("change_locale", %{"locale" => locale}, socket) do
    {:noreply, redirect(socket, to: ~p"/?locale=#{locale}")}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{gettext("API keys")}</h1>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            {gettext("System admins only")}
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {gettext(
            "Manage API keys used by external applications to trigger workflows and query nodes."
          )}
        </p>
      </div>

      <%= if @created_token do %>
        <div class="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-4">
          <p class="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            {gettext("Your new API key")} — {gettext("Copy this token now")}
          </p>
          <p class="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
            {gettext("Make sure to copy your key now. You will not be able to see it again.")}
          </p>
          <div class="mt-3 flex items-center gap-2">
            <input
              type="text"
              readonly
              value={@created_token}
              class="w-full font-mono text-xs bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      <% end %>

      <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {gettext("Create key")}
        </h2>

        <.form for={@form} id="api-key-form" phx-submit="create" class="space-y-4">
          <div>
            <.input
              field={@form[:name]}
              id="api_key_name"
              label={gettext("Name")}
              placeholder={gettext("e.g. Production Webhook")}
              required
            />
          </div>

          <div>
            <.input
              type="select"
              field={@form[:expires_in]}
              id="api_key_expires_in"
              label={gettext("Expiration")}
              options={@expiration_options}
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-semibold text-gray-900 dark:text-white">
                {gettext("Scopes")}
              </label>
              <button
                type="button"
                id="api-key-scope-toggle"
                data-scope-selector="input[name='api_key[scopes][]']"
                phx-hook="ApiKeyScopeToggle"
                class="text-xs font-semibold text-primary hover:underline"
              >
                {gettext("Toggle all")}
              </button>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {gettext("Choose which endpoints this key is authorized to access.")}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <%= for scope <- @scopes do %>
                <label class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/60 cursor-pointer">
                  <input
                    type="checkbox"
                    name="api_key[scopes][]"
                    value={scope}
                    checked
                    class="mt-1 rounded border-gray-300 dark:border-slate-700 text-primary focus:ring-primary"
                  />
                  <div>
                    <span class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">
                      {scope}
                    </span>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {scope_description(scope)}
                    </p>
                  </div>
                </label>
              <% end %>
            </div>
          </div>

          <div class="pt-2">
            <.button variant="primary" type="submit">
              {gettext("Generate API key")}
            </.button>
          </div>
        </.form>
      </div>

      <div class="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-800">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {gettext("Existing keys")}
          </h2>
        </div>

        <%= if Enum.empty?(@api_keys) do %>
          <div class="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {gettext("No active API keys found.")}
          </div>
        <% else %>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-xs uppercase border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th class="px-6 py-3">{gettext("Name")}</th>
                  <th class="px-6 py-3">{gettext("Prefix")}</th>
                  <th class="px-6 py-3">{gettext("Scopes")}</th>
                  <th class="px-6 py-3">{gettext("Created")}</th>
                  <th class="px-6 py-3">{gettext("Expires")}</th>
                  <th class="px-6 py-3">{gettext("Last used")}</th>
                  <th class="px-6 py-3 text-right">{gettext("Actions")}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-slate-800 text-gray-800 dark:text-gray-200">
                <%= for key <- @api_keys do %>
                  <tr id={"api-key-#{key.id}"} class="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td class="px-6 py-4 font-medium">{key.name}</td>
                    <td class="px-6 py-4 font-mono text-xs">{key.prefix}…</td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <%= for scope <- key.scopes do %>
                          <span class="font-mono text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                            {scope}
                          </span>
                        <% end %>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {Calendar.strftime(key.inserted_at, "%Y-%m-%d %H:%M")}
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <%= if key.expires_at do %>
                        {Calendar.strftime(key.expires_at, "%Y-%m-%d %H:%M")}
                      <% else %>
                        <span class="text-gray-400 dark:text-gray-500">{gettext("Never")}</span>
                      <% end %>
                    </td>
                    <td class="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      <%= if key.last_used_at do %>
                        {Calendar.strftime(key.last_used_at, "%Y-%m-%d %H:%M")}
                      <% else %>
                        <span class="text-gray-400 dark:text-gray-500">{gettext("Never")}</span>
                      <% end %>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <%= if ApiKey.revoked?(key) do %>
                        <span class="text-xs text-red-500 font-semibold">{gettext("Revoked")}</span>
                      <% else %>
                        <.button
                          variant="danger"
                          type="button"
                          phx-click="revoke"
                          phx-value-id={key.id}
                          data-confirm={gettext("Are you sure you want to revoke this API key?")}
                        >
                          {gettext("Revoke")}
                        </.button>
                      <% end %>
                    </td>
                  </tr>
                <% end %>
              </tbody>
            </table>
          </div>
        <% end %>
      </div>
    </div>
    """
  end

  defp assign_api_keys(socket) do
    assign(socket, :api_keys, ApiKeys.list_api_keys(socket.assigns.current_scope))
  end

  defp api_key_form do
    to_form(%{"name" => "", "expires_in" => "never", "scopes" => ApiKey.scopes()},
      as: :api_key
    )
  end

  defp expires_at("never"), do: nil

  defp expires_at(days) when is_binary(days) do
    case Integer.parse(days) do
      {int, ""} -> DateTime.add(DateTime.utc_now(), int, :day)
      _ -> nil
    end
  end

  defp expires_at(_), do: nil

  defp scope_description("workflows:read"),
    do: gettext("Read workflow details and list workflows.")

  defp scope_description("workflows:write"), do: gettext("Create, update and delete workflows.")
  defp scope_description("executions:read"), do: gettext("Read workflow executions and statuses.")
  defp scope_description("executions:write"), do: gettext("Trigger workflow executions.")
  defp scope_description("nodes:read"), do: gettext("Read registered node definitions.")
  defp scope_description(other), do: other
end
