import cssText from "data-text:@/style.css";

import "@/style.css";

import type { PlasmoCSConfig } from "plasmo";

import { XToolBar } from "@/content/x/toolbar";
import { useFindElement } from "@/hooks/use-find-element";
import { CLERK_PUBLISHABLE_KEY, EXTENSION_URL } from "@/lib/env";
import { ClerkProvider } from "@clerk/chrome-extension";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*"],
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export default function Content() {
  const selector = () => {
    const toolBar = document.querySelector('div[data-testid="toolBar"]');
    const target = toolBar?.querySelector('div[data-testid="ScrollSnap-List"]');
    return target;
  };
  const targetElement = useFindElement(selector);
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl={`${EXTENSION_URL}/popup.html`}
      signInFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
      signUpFallbackRedirectUrl={`${EXTENSION_URL}/popup.html`}
    >
      {targetElement ? createPortal(<XToolBar />, targetElement) : null}
      {createPortal(<Toaster richColors />, document.body)}
    </ClerkProvider>
  );
}
