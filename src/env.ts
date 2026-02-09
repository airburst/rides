import { z } from "zod";

const schema = z.object({
  VITE_CLUB_LONG_NAME: z.string().optional(),
  VITE_CLUB_SHORT_NAME: z.string().optional(),
  VITE_REPO: z.string().url().optional(),
  VITE_AUTH0_DOMAIN: z.string().optional(),
  VITE_AUTH0_CLIENT_ID: z.string().optional(),
  VITE_AUTH0_AUDIENCE: z.string().optional(),
  VITE_API_URL: z.string().url().optional(),
});

export const env = schema.parse(import.meta.env);
