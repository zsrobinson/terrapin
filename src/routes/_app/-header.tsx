import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getRouteApi,
  useLocation,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { router } from "better-auth/api";
import { PlusIcon, SlashIcon } from "lucide-react";
import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { selectOrgsQuery } from "~/lib/org";

const route = getRouteApi("/_app");

export function AppHeader() {
  const { user } = route.useRouteContext();

  return (
    <header className="fixed inset-x-0 top-0 flex justify-between border-b py-2 px-4 items-center bg-background">
      <div className="flex gap-2 items-center">
        <h1 className="text-xl font-semibold">Simple Student Org</h1>
        <SlashIcon className="-rotate-15 text-border" size={20} />
        <OrgSwitcher />
      </div>
      <span className="font-mono">{user.email}</span>
    </header>
  );
}

function OrgSwitcher() {
  const navigate = useNavigate();
  const pathname = useLocation({ select: (l) => l.pathname });
  const { data: orgs } = useSuspenseQuery(selectOrgsQuery);
  const items = [
    ...orgs.map((o) => ({ label: o.name, value: o.slug })),
    { label: "Create", value: "create" },
  ];
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prefetch = (slug: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void router.preloadRoute({ to: "/$org", params: { org: slug } });
    }, 100);
  };

  return (
    <Select
      items={items}
      value={pathname.split("/").at(1)}
      onValueChange={(value) => {
        if (typeof value !== "string") return;
        if (value === "new") return navigate({ to: "/create" });
        return navigate({ to: "/$org", params: { org: value } });
      }}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          {orgs.map((o) => (
            <SelectItem
              key={o.slug}
              value={o.slug}
              onMouseEnter={() => prefetch(o.slug)}
              onFocus={() => prefetch(o.slug)}
            >
              {o.name}
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectGroup>
          <SelectItem value="create">
            <span className="flex items-center gap-1">
              <PlusIcon />
              <span>Create</span>
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
