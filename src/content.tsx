import cssText from "data-text:@/style.css";

import "@/style.css";

import type { PlasmoCSConfig } from "plasmo";
import { createPortal } from "react-dom";

import { XToolBar } from "@/content/x/toolbar";
import { useToolbarTarget } from "@/hooks/use-toolbar-target";

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export default function Content() {
  const targetElement = useToolbarTarget();
  return targetElement ? createPortal(<XToolBar />, targetElement) : null;
}
