import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export const forms = sqliteTable("forms", {
    id: text("id").primaryKey(),

    userId: text("user_id")
        .notNull()
        .references(() => user.id, {
            onDelete: "cascade",
        }),

    title: text("title").notNull(),

    description: text("description"),

    slug: text("slug").notNull().unique(),

    theme: text("theme").notNull().default("minimal"),

    primaryColor: text("primary_color").default("#000000"),

    logoUrl: text("logo_url"),

    backgroundUrl: text("background_url"),

    isPublished: integer("is_published", {
        mode: "boolean",
    })
        .notNull()
        .default(false),

    createdAt: integer("created_at", {
        mode: "timestamp_ms",
    })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),

    updatedAt: integer("updated_at", {
        mode: "timestamp_ms",
    })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => new Date())
        .notNull(),
});

export const questions = sqliteTable("questions", {
    id: text("id").primaryKey(),

    formId: text("form_id")
        .notNull()
        .references(() => forms.id, {
            onDelete: "cascade",
        }),

    type: text("type").notNull(),

    title: text("title").notNull(),

    placeholder: text("placeholder"),

    required: integer("required", {
        mode: "boolean",
    })
        .notNull()
        .default(false),

    position: integer("position").notNull(),

    optionsJson: text("options_json"),

    createdAt: integer("created_at", {
        mode: "timestamp_ms",
    })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
});

export const responses = sqliteTable("responses", {
    id: text("id").primaryKey(),

    formId: text("form_id")
        .notNull()
        .references(() => forms.id, {
            onDelete: "cascade",
        }),

    submittedAt: integer("submitted_at", {
        mode: "timestamp_ms",
    })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
});

export const answers = sqliteTable("answers", {
    id: text("id").primaryKey(),

    responseId: text("response_id")
        .notNull()
        .references(() => responses.id, {
            onDelete: "cascade",
        }),

    questionId: text("question_id")
        .notNull()
        .references(() => questions.id, {
            onDelete: "cascade",
        }),

    value: text("value").notNull(),
});