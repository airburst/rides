"use client";

import { type User } from "@/types";
import { useState, type ChangeEvent } from "react";
import { UserCard } from "../Card";

export type UsersListProps = {
  users: User[];
}

const UsersList = ({ users }: UsersListProps) => {
  const [searchText, setSearchText] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [onlyMembers, setOnlyMembers] = useState<boolean>(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
  };

  const handleRoleSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(event.currentTarget.value);
  };

  const handleMembersChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setOnlyMembers(event.currentTarget.checked);
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
      `${name}${email}`.toLowerCase().includes(searchText.toLowerCase())
    )
    : users;
  const filteredMembers = onlyMembers ? filteredUsers.filter(({ isMember }) => isMember) : filteredUsers;
  const filteredRoles = roleFilter === "ALL"
    ? filteredMembers
    : filteredMembers.filter(({ role }) => role === roleFilter);

  return (
    <>
      <div className="flex flex-col md:flex-row w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-4 px-2 md:px-0 text-neutral-700">
        <input
          type="text"
          id="search"
          name="search"
          className="input input-bordered input-lg w-full"
          placeholder="Search by name or email"
          onChange={handleSearch}
        />
        <div className="flex flex-row gap-2 md:gap-4 justify-between">
          <label htmlFor="role" className="flex-1 flex flex-row gap-2 items-center">
            Role
            <select
              id="role"
              className="input input-bordered w-full md:w-32"
              defaultValue={roleFilter}
              onChange={handleRoleSelected}
            >
              <option value="ALL">All Roles</option>
              <option value="USER">USER</option>
              <option value="LEADER">LEADER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <label htmlFor="members" className="flex flex-row gap-2 items-center justify-end">
            <span className="pr-2">Members</span>
            <input
              id="members"
              type="checkbox"
              className="checkbox checkbox-primary checkbox-lg my-2"
              onChange={handleMembersChecked}
            />
          </label>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2 sm:px-0">
        {filteredRoles.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}

export default UsersList;