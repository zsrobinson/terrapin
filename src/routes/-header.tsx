import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";
import { Button, buttonVariants } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

const route = getRouteApi("__root__");

export function IndexHeader() {
  const { session, user } = route.useRouteContext();
  const navigate = useNavigate();

  return (
    <header className="flex justify-between border-b p-4">
      <h1 className="text-2xl font-semibold">Simple Student Org</h1>

      <div className="flex gap-2">
        {session ? (
          <>
            <Button
              onClick={async () => {
                await authClient.signOut();
                await navigate({ to: "/" });
              }}
              variant="ghost"
            >
              Logout
            </Button>

            <div
              className="bg-secondary text-secondary-foreground w-8 h-8 rounded-full"
              title={user?.email}
            >
              <UserIcon />
            </div>
          </>
        ) : (
          <Link to="/login" className={buttonVariants({ variant: "default" })}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
