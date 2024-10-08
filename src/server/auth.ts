import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Auth0Provider from "next-auth/providers/auth0";

import { env } from "@/env";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema/index";
import { type Preferences, type Role, type User } from "@/types";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  export interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        // @ts-expect-error `role is not a property of AdapterUser`
        role: user.role as Role,
        // @ts-expect-error `preferences is not a property of AdapterUser`
        preferences: user.preferences as Preferences,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
  ],
  // Custom pages
  pages: {
    newUser: "/profile",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

// Helper for server actions
export const canUseAction = async (
  allowedRole = "USER",
  allowedUserId?: string,
) => {
  const session = await getServerAuthSession();
  const id = session?.user!.id;
  const role = session?.user!.role;
  const isMyRecord = allowedUserId && id === allowedUserId;

  if (!role) {
    return false;
  }

  // ADMIN and LEADER can do everything
  if (allowedRole === "ADMIN") {
    return role === "ADMIN" || isMyRecord;
  }
  if (allowedRole === "LEADER") {
    return role === "LEADER" || role === "ADMIN" || isMyRecord;
  }
  // USER
  return allowedUserId ? id === allowedUserId : true;
};
