import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessionQuery } from "~/lib/auth-queries";
import { selectOrgsQuery } from "~/lib/org";
import { AppHeader } from "./-header";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    const session = await context.queryClient.ensureQueryData(sessionQuery);
    if (!session) throw redirect({ to: "/" });
    return { ...session };
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(selectOrgsQuery),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="w-full [&>header]:h-12 [&>div]:mt-12">
      <AppHeader />
      <Outlet />
    </main>
  );
}
