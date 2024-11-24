"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:sp-bg-sidebar-accent data-[state=open]:sp-text-sidebar-accent-foreground"
            >
              <Avatar className="sp-h-8 sp-w-8 sp-rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="sp-rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="sp-grid sp-flex-1 sp-text-left sp-text-sm sp-leading-tight">
                <span className="sp-truncate sp-font-semibold">
                  {user.name}
                </span>
                <span className="sp-truncate sp-text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="sp-ml-auto sp-size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="sp-w-[--radix-dropdown-menu-trigger-width] sp-min-w-56 sp-rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="sp-p-0 sp-font-normal">
              <div className="sp-flex sp-items-center sp-gap-2 sp-px-1 sp-py-1.5 sp-text-left sp-text-sm">
                <Avatar className="sp-h-8 sp-w-8 sp-rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="sp-rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="sp-grid sp-flex-1 sp-text-left sp-text-sm sp-leading-tight">
                  <span className="sp-truncate sp-font-semibold">
                    {user.name}
                  </span>
                  <span className="sp-truncate sp-text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
