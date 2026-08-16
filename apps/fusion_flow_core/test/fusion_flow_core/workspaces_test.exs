defmodule FusionFlowCore.WorkspacesTest do
  use FusionFlowCore.DataCase, async: true

  alias FusionFlowCore.Accounts.Scope
  alias FusionFlowCore.Workspaces
  alias FusionFlowCore.Workspaces.{Member, Workspace}

  import FusionFlowCore.AccountsFixtures

  describe "create_workspace/2" do
    test "creates workspace and assigns creator as owner" do
      user = user_fixture()
      attrs = %{name: "Engineering", slug: "engineering"}

      assert {:ok, %{workspace: %Workspace{} = ws, member: %Member{} = member}} =
               Workspaces.create_workspace(user, attrs)

      assert ws.name == "Engineering"
      assert ws.slug == "engineering"
      assert member.user_id == user.id
      assert member.workspace_id == ws.id
      assert member.role == "owner"
    end

    test "validates required fields and slug uniqueness" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Workspaces.create_workspace(user, %{name: ""})

      {:ok, _} = Workspaces.create_workspace(user, %{name: "Test", slug: "unique-slug"})

      assert {:error, %Ecto.Changeset{}} =
               Workspaces.create_workspace(user, %{name: "Test 2", slug: "unique-slug"})
    end
  end

  describe "fetch_member_workspace/2" do
    test "returns workspace and member when user belongs to workspace" do
      user = user_fixture()

      {:ok, %{workspace: ws, member: member}} =
        Workspaces.create_workspace(user, %{name: "My Team", slug: "my-team"})

      assert {:ok, %{workspace: fetched_ws, member: fetched_member}} =
               Workspaces.fetch_member_workspace(user, "my-team")

      assert fetched_ws.id == ws.id
      assert fetched_member.id == member.id
    end

    test "returns {:error, :not_found} when user is not a member (no existence leak)" do
      user1 = user_fixture()
      user2 = user_fixture()
      {:ok, _} = Workspaces.create_workspace(user1, %{name: "Secret Team", slug: "secret-team"})

      assert {:error, :not_found} = Workspaces.fetch_member_workspace(user2, "secret-team")
      assert {:error, :not_found} = Workspaces.fetch_member_workspace(user2, "non-existent")
    end

    test "system admin can fetch any workspace as virtual owner" do
      admin = system_admin_fixture()
      regular_user = user_fixture()

      {:ok, %{workspace: ws}} =
        Workspaces.create_workspace(regular_user, %{name: "Other Team", slug: "other-team"})

      assert {:ok, %{workspace: fetched_ws, member: fetched_member}} =
               Workspaces.fetch_member_workspace(admin, "other-team")

      assert fetched_ws.id == ws.id
      assert fetched_member.role == "owner"
    end
  end

  describe "member management & last owner protection" do
    test "add, update role, and remove members" do
      owner = user_fixture()
      editor_user = user_fixture()

      {:ok, %{workspace: ws, member: owner_member}} =
        Workspaces.create_workspace(owner, %{name: "Dev Team", slug: "dev-team"})

      owner_scope = Scope.for_membership(owner, ws, owner_member)

      assert {:ok, %Member{} = editor_member} =
               Workspaces.add_member(owner_scope, editor_user, :editor)

      assert editor_member.role == "editor"

      # Update role
      assert {:ok, updated} = Workspaces.update_member_role(owner_scope, editor_member, :admin)
      assert updated.role == "admin"

      # Remove member
      assert {:ok, _deleted} = Workspaces.remove_member(owner_scope, editor_member)
    end

    test "cannot demote or remove the last owner" do
      owner = user_fixture()

      {:ok, %{workspace: ws, member: owner_member}} =
        Workspaces.create_workspace(owner, %{name: "Solo Team", slug: "solo-team"})

      owner_scope = Scope.for_membership(owner, ws, owner_member)

      assert {:error, :cannot_remove_last_owner} =
               Workspaces.update_member_role(owner_scope, owner_member, :editor)

      assert {:error, :cannot_remove_last_owner} =
               Workspaces.remove_member(owner_scope, owner_member)
    end
  end

  describe "workspace invites" do
    test "create_workspace_invite and register_user_with_invite adds member to workspace" do
      owner = user_fixture()

      {:ok, %{workspace: ws, member: owner_member}} =
        Workspaces.create_workspace(owner, %{name: "Alpha Org", slug: "alpha-org"})

      scope = Scope.for_membership(owner, ws, owner_member)

      assert {:ok, invite} =
               FusionFlowCore.Accounts.create_workspace_invite(scope, %{
                 role: "editor",
                 email: "newmember@example.com"
               })

      assert invite.workspace_id == ws.id
      assert invite.role == "editor"

      attrs = %{
        username: "newmember",
        email: "newmember@example.com",
        password: "password123456",
        password_confirmation: "password123456"
      }

      assert {:ok, user} = FusionFlowCore.Accounts.register_user_with_invite(attrs, invite)

      assert {:ok, %{member: member}} = Workspaces.fetch_member_workspace(user, "alpha-org")
      assert member.role == "editor"

      workspaces = Workspaces.list_workspaces_for_user(user)
      assert length(workspaces) >= 2
      assert Enum.any?(workspaces, &(&1.slug == "alpha-org"))
      assert Enum.any?(workspaces, &(&1.slug =~ "newmember"))
    end
  end
end
