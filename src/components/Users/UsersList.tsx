import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { type User } from "@/types";
import { Link } from "@tanstack/react-router";
import { useState, type ChangeEvent } from "react";
import { UserCard } from "../Card";

export type UsersListProps = {
  users: User[];
};

const UsersList = ({ users }: UsersListProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
  };

  const handleRoleSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(event.currentTarget.value);
  };

  const handleMembershipStatusSelected = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setStatusFilter(event.currentTarget.value);
  };

  const userCount = users.length;

  if (userCount === 0) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center justify-center p-8 pt-32 text-2xl">
          No users found
        </div>
      </div>
    );
  }

  const filteredUsers = searchText
    ? users.filter(({ name, email }) =>
        `${name}${email}`.toLowerCase().includes(searchText.toLowerCase()),
      )
    : users;
  const filteredMembers =
    statusFilter === "ALL"
      ? filteredUsers
      : filteredUsers.filter(
          ({ membershipStatus }) => membershipStatus === statusFilter,
        );
  const filteredRoles =
    roleFilter === "ALL"
      ? filteredMembers
      : filteredMembers.filter(({ role }) => role === roleFilter);

  return (
    <>
      <div className="mb-4 lg:mb-8 grid w-full grid-cols-1 gap-2 px-2 text-neutral-700 md:px-0 lg:grid-cols-3 lg:gap-8">
        <Input
          type="text"
          id="search"
          name="search"
          className="h-12 lg:h-16"
          placeholder="Search by name or email"
          onChange={handleSearch}
        />

        <label
          htmlFor="role"
          className="flex flex-1 flex-row items-center gap-2"
        >
          <span className="w-32 lg:w-auto">Role</span>
          <NativeSelect
            id="role"
            className="flex-1 md:w-32 h-12 lg:h-16"
            defaultValue={roleFilter}
            onChange={handleRoleSelected}
          >
            <option value="ALL">All Roles</option>
            <option value="USER">USER</option>
            <option value="LEADER">LEADER</option>
            <option value="ADMIN">ADMIN</option>
          </NativeSelect>
        </label>

        <label
          htmlFor="membershipStatus"
          className="flex flex-1 flex-row items-center gap-2"
        >
          <span className="w-32 lg:w-auto">Membership</span>
          <NativeSelect
            id="membershipStatus"
            className="flex-1 md:w-32 h-12 lg:h-16"
            defaultValue={statusFilter}
            onChange={handleMembershipStatusSelected}
          >
            <option value="ALL">Any Status</option>
            <option value="MEMBER">Members</option>
            <option value="EXPIRED">Expired</option>
            <option value="NOT_MEMBER">Non Members</option>
            <option value="OTHER_CLUB">Other Clubs</option>
          </NativeSelect>
        </label>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 px-2 sm:px-0 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {filteredRoles.map((user) => (
          <Link to="/profile/$id" params={{ id: user.id }} key={user.id}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default UsersList;
