defmodule FusionFlowCore.PolicyTest do
  use ExUnit.Case, async: true

  alias FusionFlowCore.Accounts.{Scope, User}
  alias FusionFlowCore.Policy

  describe "permissions_for/1" do
    test "viewer permissions" do
      perms = Policy.permissions_for(:viewer)
      assert MapSet.member?(perms, :view_flows)
      assert MapSet.member?(perms, :view_executions)
      assert MapSet.member?(perms, :view_deps)
      assert MapSet.member?(perms, :view_members)
      refute MapSet.member?(perms, :create_flows)
      refute MapSet.member?(perms, :edit_flows)
      refute MapSet.member?(perms, :delete_flows)
      refute MapSet.member?(perms, :manage_members)
    end

    test "editor permissions" do
      perms = Policy.permissions_for(:editor)
      assert MapSet.member?(perms, :view_flows)
      assert MapSet.member?(perms, :create_flows)
      assert MapSet.member?(perms, :edit_flows)
      assert MapSet.member?(perms, :execute_flows)
      assert MapSet.member?(perms, :manage_deps)
      refute MapSet.member?(perms, :delete_flows)
      refute MapSet.member?(perms, :manage_members)
      refute MapSet.member?(perms, :delete_workspace)
    end

    test "admin permissions" do
      perms = Policy.permissions_for(:admin)
      assert MapSet.member?(perms, :view_flows)
      assert MapSet.member?(perms, :edit_flows)
      assert MapSet.member?(perms, :delete_flows)
      assert MapSet.member?(perms, :manage_members)
      assert MapSet.member?(perms, :manage_api_keys)
      assert MapSet.member?(perms, :manage_workspace)
      refute MapSet.member?(perms, :transfer_ownership)
      refute MapSet.member?(perms, :delete_workspace)
    end

    test "owner permissions" do
      perms = Policy.permissions_for(:owner)
      assert MapSet.member?(perms, :view_flows)
      assert MapSet.member?(perms, :edit_flows)
      assert MapSet.member?(perms, :delete_flows)
      assert MapSet.member?(perms, :manage_members)
      assert MapSet.member?(perms, :transfer_ownership)
      assert MapSet.member?(perms, :delete_workspace)
    end

    test "string role overload" do
      assert Policy.permissions_for("owner") == Policy.permissions_for(:owner)
      assert Policy.permissions_for("editor") == Policy.permissions_for(:editor)
    end
  end

  describe "can?/2 and authorize/2" do
    test "system admin can do anything" do
      admin_user = %User{id: 1, is_system_admin: true}
      scope = %Scope{user: admin_user, is_system_admin: true}

      assert Policy.can?(scope, :delete_workspace)
      assert Policy.can?(scope, :transfer_ownership)
      assert Policy.can?(scope, :non_existent_perm)
      assert :ok = Policy.authorize(scope, :delete_workspace)
    end

    test "evaluates role permissions on scope" do
      editor_scope = %Scope{
        user: %User{id: 2, is_system_admin: false},
        role: :editor,
        permissions: Policy.permissions_for(:editor),
        is_system_admin: false
      }

      assert Policy.can?(editor_scope, :edit_flows)
      assert :ok = Policy.authorize(editor_scope, :edit_flows)

      refute Policy.can?(editor_scope, :delete_flows)
      assert {:error, :unauthorized} = Policy.authorize(editor_scope, :delete_flows)
    end

    test "nil scope returns false / unauthorized" do
      refute Policy.can?(nil, :view_flows)
      assert {:error, :unauthorized} = Policy.authorize(nil, :view_flows)
    end
  end

  describe "permissions_for_api_scopes/1" do
    test "maps api scope strings" do
      perms = Policy.permissions_for_api_scopes(["flows:read", "executions:write"])
      assert MapSet.member?(perms, :view_flows)
      assert MapSet.member?(perms, :execute_flows)
      refute MapSet.member?(perms, :delete_flows)
    end
  end
end
