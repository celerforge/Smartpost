import { GeneralSettings } from "@/options/settings/general-settings";
import { ModelProviderSettings } from "@/options/settings/model-provider-settings";
import { XTools } from "@/options/tools/x-tools";
import { Paintbrush, Settings2, X } from "lucide-react";

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

  SETTINGS = "#settings",
  SETTINGS_GENERAL = "#settings/general",
  SETTINGS_MODEL_PROVIDER = "#settings/model-provider",
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
          icon: X,
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
          title: "Model Provider",
          url: RoutePaths.SETTINGS_MODEL_PROVIDER,
        },
      ],
    },
  ] as NavItem[],
};

export const ROUTES_MAP = {
  [RoutePaths.SETTINGS_GENERAL]: GeneralSettings,
  [RoutePaths.SETTINGS_MODEL_PROVIDER]: ModelProviderSettings,
  [RoutePaths.TOOLS_X]: XTools,
} as const;

export type RouteKey = keyof typeof ROUTES_MAP;
export const DEFAULT_ROUTE = RoutePaths.TOOLS_X;
