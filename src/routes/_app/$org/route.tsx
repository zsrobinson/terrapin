import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { selectOrgQuery } from "~/lib/org";
import { Sidebar } from "./-sidebar";

export const Route = createFileRoute("/_app/$org")({
  beforeLoad: async ({ context, params }) => {
    const org = await context.queryClient.ensureQueryData(
      selectOrgQuery(params.org),
    );
    if (!org) throw notFound();
    return { org };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="[&>aside]:w-48 [&>main]:ml-48">
      <Sidebar />
      <Outlet />
    </div>
  );
}
