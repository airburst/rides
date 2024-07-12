"use client";

import { type User } from "@/types";
import { useState, type ChangeEvent } from "react";
import { UserCard } from "../Card";

export type UsersListProps = {
  users: User[];
}

const UsersList = ({ users }: UsersListProps) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.currentTarget.value);
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

  return (
    <>
      <div className="w-full px-2 sm:px-0">
        <input
          type="text"
          id="search"
          name="search"
          className="input input-bordered input-lg w-full mb-4"
          placeholder="Search by name or email"
          onChange={handleSearch}
        />
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2 sm:px-0">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </>
  );
}

export default UsersList;