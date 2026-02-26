# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     FusionFlow.Repo.insert!(%FusionFlow.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`)
# and so on) as they will fail if something goes wrong.

# In development and test, create a system admin (username: admin, password: admin)
# for local login and e2e tests. Skip if a system admin already exists.
if Mix.env() in [:dev, :test] do
  alias FusionFlow.Accounts

  unless Accounts.has_system_admin?() do
    {:ok, _user} =
      Accounts.register_system_admin(%{
        email: "admin@example.com",
        username: "admin",
        password: "admin"
      })

    IO.puts("Created system admin: username=admin, password=admin")
  end
end
