import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";
import type { Bindings } from "../types";

export const createDb = (env: Bindings) => {
    return drizzle(env.survey_builder, { schema: { ...schema, ...authSchema } });
}

export type DB = ReturnType<typeof createDb>;