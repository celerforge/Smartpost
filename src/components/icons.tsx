import { RefreshCw, type LucideIcon } from "lucide-react";
import { type FC, type SVGProps } from "react";

export type Icon = LucideIcon | FC<SVGProps<SVGSVGElement>>;

export const Icons: Record<string, Icon> = {
  refreshCw: RefreshCw,
};
