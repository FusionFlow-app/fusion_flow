defmodule FusionFlow.Dependencies do
  @moduledoc """
  Context for managing project dependencies.
  """

  import Ecto.Query, warn: false
  alias FusionFlow.Repo
  alias FusionFlow.Dependencies.Dependency

  def list_dependencies do
    Repo.all(Dependency)
  end

  def list_installed_mix_deps do
    Mix.Project.config()[:deps]
    |> Enum.map(fn
      {app, requirement} when is_binary(requirement) ->
        %{name: Atom.to_string(app), version: requirement, language: "elixir"}

      {app, opts} when is_list(opts) ->
        version = format_opts(opts)
        %{name: Atom.to_string(app), version: version, language: "elixir"}

      {app, requirement, _opts} ->
        version = if is_binary(requirement), do: requirement, else: inspect(requirement)
        %{name: Atom.to_string(app), version: version, language: "elixir"}

      other ->
        %{name: inspect(other), version: "Unknown format", language: "elixir"}
    end)
  end

  defp format_opts(opts) do
    cond do
      opts[:git] -> "Git: #{opts[:git]}"
      opts[:github] -> "GitHub: #{opts[:github]}"
      opts[:path] -> "Path: #{opts[:path]}"
      true -> "Custom Options"
    end
  end

  def search_hex(term) do
    url = "https://hex.pm/api/packages"

    case Req.get(url, params: [search: "name:#{term}", sort: "downloads"]) do
      {:ok, %{status: 200, body: body}} ->
        results =
          body
          |> Enum.map(fn pkg ->
            %{
              name: pkg["name"],
              description: pkg["meta"]["description"],
              latest_version: pkg["latest_version"],
              downloads: pkg["downloads"]["all"],
              url: pkg["html_url"],
              inserted_at: pkg["inserted_at"],
              updated_at: pkg["updated_at"]
            }
          end)

        {:ok, results}

      {:ok, %{status: status}} ->
        {:error, "Hex API returned status #{status}"}

      {:error, reason} ->
        {:error, inspect(reason)}
    end
  end

  def add_dependency(name, version, language \\ "elixir", opts \\ []) do
    stream_to = opts[:stream_to]

    case create_or_update_dependency(%{name: name, version: version, language: language}) do
      {:ok, dep} ->
        if language == "elixir" do
          case add_mix_dep(name, version) do
            {:ok, _} ->
              run_mix_deps_get(name, stream_to)
              {:ok, dep}

            error ->
              error
          end
        else
          {:ok, dep}
        end

      error ->
        error
    end
  end

  defp create_or_update_dependency(attrs) do
    case Repo.get_by(Dependency, name: attrs.name, language: attrs.language) do
      nil ->
        %Dependency{}
        |> Dependency.changeset(attrs)
        |> Repo.insert()

      existing ->
        existing
        |> Dependency.changeset(attrs)
        |> Repo.update()
    end
  end

  defp add_mix_dep(name, version) do
    if Code.ensure_loaded?(Igniter) do
      igniter = Igniter.new()
      igniter = Igniter.Project.Deps.add_dep(igniter, {String.to_atom(name), "~> #{version}"})

      try do
        for {path, source} <- igniter.rewrite.sources, String.ends_with?(path, "mix.exs") do
          new_content = Rewrite.Source.get(source, :content)
          File.write!(path, new_content)
        end

        {:ok, "Added using Igniter"}
      rescue
        e ->
          IO.warn("Igniter write failed: #{inspect(e)}")
          {:error, "Igniter write failed: #{inspect(e)}"}
      end
    else
      {:error, "Igniter not loaded"}
    end
  end

  defp run_mix_deps_get(name, nil) do
    {_, _} =
      System.cmd("mix", ["do", "deps.get,", "deps.compile", name, ",", "compile"],
        cd: File.cwd!()
      )
  end

  defp run_mix_deps_get(name, pid) do
    cmd = "mix do deps.get, deps.compile #{name}, compile"
    send(pid, {:dep_log, "Running `#{cmd}`...\n"})

    port = Port.open({:spawn, cmd}, [:binary, :exit_status])
    loop_port(port, pid)
  end

  defp loop_port(port, pid) do
    receive do
      {^port, {:data, data}} ->
        send(pid, {:dep_log, data})
        loop_port(port, pid)

      {^port, {:exit_status, status}} ->
        if status == 0 do
          send(pid, {:dep_log, "\nSuccess! Dependency installed and compiled.\n"})
        else
          send(pid, {:dep_log, "\nFailed with exit code #{status}.\n"})
        end
    end
  end
end
