import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { IndexHeader } from "./-header";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();

  return (
    <>
      <IndexHeader />
      <main className="p-4 flex flex-col gap-4">
        <p>Welcome to Simple Student Org!</p>
        {user ? (
          <>
            <p>You are currently logged in as {user.email}.</p>
            <Button
              nativeButton={false}
              render={<Link to="/app">Enter App</Link>}
            />
          </>
        ) : (
          <p>You are not currently logged in.</p>
        )}
      </main>
    </>
  );
}
