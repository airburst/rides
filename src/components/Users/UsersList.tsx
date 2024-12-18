"use client";

import { type User } from "@/types";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { UserCard } from "../Card";

export type UsersListProps = {
  users: User[];
};

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
        `${name}${email}`.toLowerCase().includes(searchText.toLowerCase()),
      )
    : users;
  const filteredMembers = onlyMembers
    ? filteredUsers.filter(({ isMember }) => isMember)
    : filteredUsers;
  const filteredRoles =
    roleFilter === "ALL"
      ? filteredMembers
      : filteredMembers.filter(({ role }) => role === roleFilter);

  return (
    <>
      <div className="mb-4 flex w-full grid-cols-1 flex-col gap-4 px-2 text-neutral-700 md:grid-cols-2 md:flex-row md:gap-8 md:px-0">
        <input
          type="text"
          id="search"
          name="search"
          className="input input-lg input-bordered w-full"
          placeholder="Search by name or email"
          onChange={handleSearch}
        />
        <div className="flex flex-row justify-between gap-2 md:gap-4">
          <label
            htmlFor="role"
            className="flex flex-1 flex-row items-center gap-2"
          >
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

          <label
            htmlFor="members"
            className="flex flex-row items-center justify-end gap-2"
          >
            <span className="pr-2">Members</span>
            <input
              id="members"
              type="checkbox"
              className="checkbox-primary checkbox checkbox-lg my-2"
              onChange={handleMembersChecked}
            />
          </label>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 px-2 sm:px-0 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {filteredRoles.map((user) => (
          <Link href={`/profile/${user.id}`} key={user.id} prefetch={true}>
            <UserCard user={user} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default UsersList;
