import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    HOST_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    SOURCE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    AUTH0_CLIENT_ID: z.string(),
    AUTH0_CLIENT_SECRET: z.string(),
    AUTH0_ISSUER: z.string(),
    RIDERHQ_URL: z.string(),
    RIDERHQ_ACCOUNT_ID: z.string(),
    RIDERHQ_PRIVATE_KEY: z.string(),
    API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLUB_LONG_NAME: z.string(),
    NEXT_PUBLIC_CLUB_SHORT_NAME: z.string(),
    NEXT_PUBLIC_REPO: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NEXT_PUBLIC_CLUB_LONG_NAME: process.env.NEXT_PUBLIC_CLUB_LONG_NAME,
    NEXT_PUBLIC_CLUB_SHORT_NAME: process.env.NEXT_PUBLIC_CLUB_SHORT_NAME,
    NEXT_PUBLIC_REPO: process.env.NEXT_PUBLIC_REPO,
    HOST_URL: process.env.HOST_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SOURCE_URL: process.env.SOURCE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
    RIDERHQ_URL: process.env.RIDERHQ_URL,
    RIDERHQ_ACCOUNT_ID: process.env.RIDERHQ_ACCOUNT_ID,
    RIDERHQ_PRIVATE_KEY: process.env.RIDERHQ_PRIVATE_KEY,
    API_KEY: process.env.API_KEY,
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
