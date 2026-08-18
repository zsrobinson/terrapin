import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/$org/calendar")({
  component: RouteComponent,
});

function RouteComponent() {
  const { org } = Route.useRouteContext();

  return (
    <main className="p-8 flex flex-col gap-4">
      <h2 className="font-semibold text-xl">{org.name} Calendar</h2>
      <p>It's empty in here...</p>
    </main>
  );
}
