import { createFileRoute, redirect } from "@tanstack/react-router";
import { selectOrgsQuery } from "~/lib/org";
import { raise } from "~/lib/utils";

export const Route = createFileRoute("/_app/app")({
  beforeLoad: async ({ context }) => {
    const orgs = await context.queryClient.ensureQueryData(selectOrgsQuery);
    const first = orgs.at(0) ?? raise(redirect({ to: "/new" }));
    throw redirect({ to: "/$org", params: { org: first.slug } });
  },
});
