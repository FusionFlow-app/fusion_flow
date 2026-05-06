defmodule FusionFlowCore.AccountsInviteTest do
  use FusionFlowCore.DataCase

  alias FusionFlowCore.Accounts
  alias FusionFlowCore.Accounts.Invite

  import FusionFlowCore.AccountsFixtures

  describe "list_users/0" do
    test "returns all users including newly created ones" do
      u1 = user_fixture()
      u2 = user_fixture()
      users = Accounts.list_users()
      ids = Enum.map(users, & &1.id)
      assert u1.id in ids
      assert u2.id in ids
      assert length(users) >= 2
    end
  end

  describe "create_invite_or_reuse/1" do
    test "returns error for non-admin user" do
      user = user_fixture()
      assert {:error, :forbidden} = Accounts.create_invite_or_reuse(user)
    end

    test "creates new invite for system admin when none valid" do
      admin = system_admin_fixture()
      assert {:ok, invite} = Accounts.create_invite_or_reuse(admin)
      assert %Invite{} = invite
      assert invite.invited_by_user_id == admin.id
      assert invite.used_at == nil
      assert DateTime.compare(DateTime.utc_now(), invite.expires_at) == :lt
    end

    test "reuses existing valid invite for same admin" do
      admin = system_admin_fixture()
      {:ok, first} = Accounts.create_invite_or_reuse(admin)
      {:ok, second} = Accounts.create_invite_or_reuse(admin)
      assert first.id == second.id
      assert first.token == second.token
    end

    test "creates new invite when previous is used" do
      admin = system_admin_fixture()
      {:ok, used_invite} = Accounts.create_invite_or_reuse(admin)
      Accounts.mark_invite_used(used_invite)
      {:ok, new_invite} = Accounts.create_invite_or_reuse(admin)
      assert new_invite.id != used_invite.id
    end

    test "creates new invite when previous is expired" do
      admin = system_admin_fixture()

      expired =
        invite_fixture(
          invited_by_user: admin,
          expires_at: DateTime.add(DateTime.utc_now(), -1, :day)
        )

      {:ok, new_invite} = Accounts.create_invite_or_reuse(admin)
      assert new_invite.id != expired.id
    end
  end

  describe "get_invite_by_token/1" do
    test "returns nil for unknown token" do
      assert is_nil(Accounts.get_invite_by_token("unknown"))
    end

    test "returns invite with preloaded invited_by_user" do
      invite = invite_fixture()
      found = Accounts.get_invite_by_token(invite.token)
      assert found.id == invite.id
      assert found.invited_by_user.id == invite.invited_by_user_id
    end
  end

  describe "mark_invite_used/1" do
    test "sets used_at on invite" do
      invite = invite_fixture()
      assert invite.used_at == nil
      assert {:ok, updated} = Accounts.mark_invite_used(invite)
      assert updated.used_at != nil
    end
  end

  describe "list_invites_by_admin/1" do
    test "returns invites for given admin only" do
      admin = system_admin_fixture()
      other = system_admin_fixture()
      i1 = invite_fixture(invited_by_user: admin)
      _i2 = invite_fixture(invited_by_user: other)
      invites = Accounts.list_invites_by_admin(admin)
      assert length(invites) == 1
      assert hd(invites).id == i1.id
    end
  end
end
