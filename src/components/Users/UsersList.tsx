import { getUsers } from "@/server/actions/getUsers";
import { UserCard } from "../Card";

type Props = {
  query?: string;
}

export const UsersList = async ({ query }: Props) => {
  const { users, error } = await getUsers(query);

  if (error) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 md:gap-8">
        <div className="flex h-full items-center p-8 pt-32 text-2xl">
          Error loading rides
        </div>
      </div>
    );
  }

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

  return (
    <div className="grid w-full grid-cols-1 gap-2 md:gap-2 px-2 sm:px-0">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
