defmodule FusionFlowCore.Accounts.InviteSchemaTest do
  use FusionFlowCore.DataCase

  alias FusionFlowCore.Accounts.Invite

  import FusionFlowCore.AccountsFixtures

  describe "expired?/1" do
    test "returns true when expires_at is in the past" do
      invite = invite_fixture(expires_at: DateTime.add(DateTime.utc_now(), -1, :hour))
      assert Invite.expired?(invite)
    end

    test "returns false when expires_at is in the future" do
      invite = invite_fixture(expires_at: DateTime.add(DateTime.utc_now(), 7, :day))
      refute Invite.expired?(invite)
    end

    test "returns true when expires_at is nil" do
      assert Invite.expired?(%Invite{expires_at: nil})
    end
  end

  describe "used?/1" do
    test "returns true when used_at is set" do
      invite = invite_fixture(used_at: DateTime.utc_now())
      assert Invite.used?(invite)
    end

    test "returns false when used_at is nil" do
      invite = invite_fixture()
      refute Invite.used?(invite)
    end
  end

  describe "valid?/1" do
    test "returns true when not expired and not used" do
      invite = invite_fixture(expires_at: DateTime.add(DateTime.utc_now(), 1, :day))
      assert Invite.valid?(invite)
    end

    test "returns false when expired" do
      invite = invite_fixture(expires_at: DateTime.add(DateTime.utc_now(), -1, :day))
      refute Invite.valid?(invite)
    end

    test "returns false when used" do
      invite = invite_fixture(used_at: DateTime.utc_now())
      refute Invite.valid?(invite)
    end
  end
end
