import { XPostOptimizer } from "@/content/x/post-optimizer";
import { XTools } from "@/content/x/tools";
import { StorageProvider } from "@/contexts/storage-context";

export function XToolBar() {
  return (
    <StorageProvider>
      <div className="sp-text-x-primary sp-flex sp-h-[34px] sp-items-center">
        <XPostOptimizer />
        <XTools />
      </div>
    </StorageProvider>
  );
}
