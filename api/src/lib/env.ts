import type { Bindings } from "../types";

export const getEnv = (env: Bindings) => ({
  db: env.DB,
  bucket: env.BUCKET,
  betterAuthSecret: env.BETTER_AUTH_SECRET,
  betterAuthUrl: env.BETTER_AUTH_URL,
});

export type Env = ReturnType<typeof getEnv>;