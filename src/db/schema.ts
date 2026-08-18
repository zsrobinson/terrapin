import { defineRelations, defineRelationsPart } from "drizzle-orm";
import { integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7";

const id = text("id")
  .primaryKey()
  .$defaultFn(() => uuidv7());

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

export const org = snakeCase.table("org", {
  id,
  slug: text().notNull().unique(),
  name: text().notNull().unique(),
  description: text().notNull().default(""),
  ...timestamps,
});

export const appRelations = defineRelationsPart({ org });
