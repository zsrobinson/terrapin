import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-orm/zod";
import z from "zod";
import { db } from "~/db";
import { org } from "~/db/schema";
import { RESERVED_SLUGS } from "./constants";

// GET ORGS

const selectOrgs = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(org);
});

export const selectOrgsQuery = queryOptions({
  queryKey: ["orgs"],
  queryFn: selectOrgs,
});

const selectOrg = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    return await db.query.org.findFirst({ where: { slug: data.slug } });
  });

export const selectOrgQuery = (slug: string) =>
  queryOptions({
    queryKey: ["orgs", slug],
    queryFn: () => selectOrg({ data: { slug } }),
  });

// INSERT ORG

export const insertOrgSchema = createInsertSchema(org, {
  slug: (s) =>
    s
      .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and dashes only")
      .min(3)
      .max(32)
      .refine((v) => !RESERVED_SLUGS.includes(v), "That name is reserved"),
  name: (s) => s.min(1),
})
  .pick({ slug: true, name: true, description: true })
  .required({ description: true });

export type InsertOrg = z.infer<typeof insertOrgSchema>;
export type Org = typeof org.$inferSelect;

export const insertOrgFn = createServerFn({ method: "POST" })
  // .middleware([requireAuth])
  .validator(insertOrgSchema)
  .handler(async ({ data }) => {
    await db.insert(org).values({ ...data });
  });
