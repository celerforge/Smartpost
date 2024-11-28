import { GeneralSettings } from "@/options/settings/general-settings";
import { LLMProviderSettings } from "@/options/settings/llm-provider-settings";
import { ComingSoon } from "@/options/tools/coming-soon";
import { XTools } from "@/options/tools/x-tools";
import { Paintbrush, Settings2 } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: Array<Omit<NavItem, "icon" | "isActive" | "items">>;
};

export const enum RoutePaths {
  TOOLS = "#tools",
  TOOLS_X = "#tools/x",
  TOOLS_BLUESKY = "#tools/bluesky",
  TOOLS_GITHUB = "#tools/github",

  SETTINGS = "#settings",
  SETTINGS_GENERAL = "#settings/general",
  SETTINGS_LLM_PROVIDER = "#settings/llm-provider",
}

export const ROUTES = {
  navMain: [
    {
      title: "Tools",
      url: RoutePaths.TOOLS,
      icon: Paintbrush,
      isActive: true,
      items: [
        {
          title: "X (Twitter)",
          url: RoutePaths.TOOLS_X,
        },
        {
          title: "Bluesky",
          url: RoutePaths.TOOLS_BLUESKY,
        },
        {
          title: "GitHub",
          url: RoutePaths.TOOLS_GITHUB,
        },
      ],
    },
    {
      title: "Settings",
      url: RoutePaths.SETTINGS,
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "General",
          url: RoutePaths.SETTINGS_GENERAL,
        },
        {
          title: "LLM Provider",
          url: RoutePaths.SETTINGS_LLM_PROVIDER,
        },
      ],
    },
  ] as NavItem[],
};

export const ROUTES_MAP = {
  [RoutePaths.SETTINGS_GENERAL]: GeneralSettings,
  [RoutePaths.SETTINGS_LLM_PROVIDER]: LLMProviderSettings,
  [RoutePaths.TOOLS_X]: XTools,
  [RoutePaths.TOOLS_BLUESKY]: ComingSoon,
  [RoutePaths.TOOLS_GITHUB]: ComingSoon,
} as const;

export type RouteKey = keyof typeof ROUTES_MAP;
export const DEFAULT_ROUTE = RoutePaths.TOOLS_X;
