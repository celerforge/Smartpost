import { XPostOptimizer } from "@/content/x/post-optimizer";
import { SettingsProvider } from "@/contexts/settings-context";

export function XToolBar() {
  return (
    <SettingsProvider>
      <div className="sp-text-x-primary sp-flex sp-h-[34px] sp-items-center sp-gap-3">
        <XPostOptimizer />
      </div>
    </SettingsProvider>
  );
}
