import { defineRelationsPart } from "drizzle-orm";
import { int, integer, snakeCase, text } from "drizzle-orm/sqlite-core";
import { uuidv7 } from "uuidv7";
import { user } from "./auth-schema";

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

export const pin = snakeCase.table("pin", {
  id,
  text: text().notNull().unique(),
  userId: text().notNull(),
  ...timestamps,
});

export const vote = snakeCase.table("vote", {
  id,
  value: int().notNull(),
  pinId: text().notNull(),
  userId: text().notNull(),
  ...timestamps,
});

export const appRelations = defineRelationsPart({ pin, vote, user }, (r) => ({
  pin: {
    user: r.one.user({
      from: r.pin.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  vote: {
    pin: r.one.pin({
      from: r.vote.pinId,
      to: r.pin.id,
      optional: false,
    }),
    user: r.one.user({
      from: r.vote.userId,
      to: r.user.id,
      optional: false,
    }),
  },
}));
