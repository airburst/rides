import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    HOST_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url().optional(),
    SOURCE_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET: z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    AUTH0_CLIENT_ID: z.string().optional(),
    AUTH0_CLIENT_SECRET: z.string().optional(),
    AUTH0_ISSUER: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLUB_LONG_NAME: z.string().optional(),
    NEXT_PUBLIC_CLUB_SHORT_NAME: z.string().optional(),
    NEXT_PUBLIC_REPO: z.string().url().optional(),
    NEXT_PUBLIC_AUTH0_DOMAIN: z.string().optional(),
    NEXT_PUBLIC_AUTH0_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_AUTH0_AUDIENCE: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_CLUB_LONG_NAME: process.env.NEXT_PUBLIC_CLUB_LONG_NAME,
    NEXT_PUBLIC_CLUB_SHORT_NAME: process.env.NEXT_PUBLIC_CLUB_SHORT_NAME,
    NEXT_PUBLIC_REPO: process.env.NEXT_PUBLIC_REPO,
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_AUTH0_AUDIENCE: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    HOST_URL: process.env.HOST_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SOURCE_URL: process.env.SOURCE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
