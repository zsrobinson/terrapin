import { createLink } from "@tanstack/react-router";
import { CalendarIcon, LayoutDashboardIcon, TypeIcon } from "lucide-react";
import React from "react";
import { Route } from ".";

export function Sidebar() {
  return (
    <aside className="fixed left-0 border-r border-border min-h-full flex flex-col gap-2 px-2 py-2">
      <SidebarItem
        from={Route.fullPath}
        to={"."}
        icon={<LayoutDashboardIcon size={16} />}
        activeOptions={{ exact: true }}
      >
        Dashboard
      </SidebarItem>

      <SidebarItem
        from={Route.fullPath}
        to={"./calendar"}
        icon={<CalendarIcon size={16} />}
      >
        Calendar
      </SidebarItem>

      <SidebarItem
        from={Route.fullPath}
        to={"./lorem"}
        icon={<TypeIcon size={16} />}
      >
        Ipsum
      </SidebarItem>
    </aside>
  );
}

type SidebarItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon: React.ReactNode;
};

const SidebarItem = createLink(
  React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
    ({ icon, children, ...props }, ref) => (
      <a
        ref={ref}
        {...props}
        className="flex gap-2 px-2 py-1 hover:bg-accent items-center rounded-lg transition-colors [&_svg]:text-muted-foreground font-medium data-[status=active]:bg-secondary"
      >
        {icon}
        {children}
      </a>
    ),
  ),
);
