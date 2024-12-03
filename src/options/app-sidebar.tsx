"use client";

import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/options/nav-main";
import { NavUser } from "@/options/nav-user";
import { ROUTES } from "@/options/route";
import { ExternalLink } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg" asChild>
          <a href="#">
            <div className="sp-text-lg sp-font-medium">Smartpost</div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ROUTES.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <a
          href="https://github.com/celerforge/smartpost/issues"
          className={buttonVariants({ variant: "link" })}
        >
          Feedback <ExternalLink />
        </a>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
