import { GeneralSettings } from "@/options/settings/general-settings";
import { ModelProviderSettings } from "@/options/settings/model-provider-settings";
import { Settings2 } from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon?: React.ComponentType;
  isActive?: boolean;
  items?: Array<Omit<NavItem, "icon" | "isActive" | "items">>;
};

export const enum RoutePaths {
  GENERAL = "#settings/general",
  MODEL_PROVIDER = "#settings/model-provider",
}

export const ROUTES = {
  navMain: [
    {
      title: "Settings",
      url: "#settings",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "General",
          url: RoutePaths.GENERAL,
        },
        {
          title: "Model Provider",
          url: RoutePaths.MODEL_PROVIDER,
        },
      ],
    },
  ] as NavItem[],
};

export const ROUTES_MAP = {
  [RoutePaths.GENERAL]: GeneralSettings,
  [RoutePaths.MODEL_PROVIDER]: ModelProviderSettings,
} as const;

export type RouteKey = keyof typeof ROUTES_MAP;
export const DEFAULT_ROUTE = Object.keys(ROUTES_MAP)[0] as RouteKey;
