import { XPostOptimizer } from "@/content/x/post-optimizer";
import { SettingsProvider } from "@/contexts/settings-context";

export function XToolBar() {
  return (
    <SettingsProvider>
      <div className="text-x-primary flex h-[34px] items-center gap-3">
        <XPostOptimizer />
      </div>
    </SettingsProvider>
  );
}
