import { Button } from "@/components/ui/button";
import { useStorage } from "@/contexts/storage-context";
import { cn } from "@/lib/utils";
import { PROVIDERS } from "@/options/settings/llm-provider-settings/config";
import { ProviderConfigDialog } from "@/options/settings/llm-provider-settings/dialog";
import type { LLMProvider } from "@/options/settings/llm-provider-settings/types";
import { useState } from "react";

export function LLMProviderSettings() {
  const { storage } = useStorage();
  const [configuring, setConfiguring] = useState<LLMProvider["id"] | null>(
    null,
  );

  return (
    <div className="sp-space-y-6">
      <div>
        <h3 className="sp-text-lg sp-font-medium">
          AI Model Provider Settings
        </h3>
        <p className="sp-text-muted-foreground sp-text-sm">
          Configure and manage your AI service providers
        </p>
      </div>

      <div className="sp-grid sp-gap-4">
        {PROVIDERS.map((provider) => {
          const isAvailable = storage.settings.providers[provider.id].available;

          return (
            <div
              key={provider.id}
              className="sp-flex sp-items-center sp-justify-between sp-rounded-lg sp-border sp-p-4"
            >
              <div className="sp-flex sp-items-center sp-space-x-4">
                <div className="sp-space-y-1">
                  <div className="sp-flex sp-items-center sp-gap-2">
                    <h4 className="sp-text-base">{provider.name}</h4>
                    <span
                      className={cn(
                        "sp-text-sm",
                        isAvailable ? "sp-text-green-600" : "sp-text-red-600",
                      )}
                    >
                      • {isAvailable ? "Connected" : "Not Connected"}
                    </span>
                  </div>
                  <p className="sp-text-secondary-foreground sp-text-sm">
                    {provider.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfiguring(provider.id)}
              >
                Configure
              </Button>
            </div>
          );
        })}

        {configuring && (
          <ProviderConfigDialog
            provider={PROVIDERS.find((p) => p.id === configuring)!}
            open={true}
            onOpenChange={(open) => !open && setConfiguring(null)}
          />
        )}
      </div>
    </div>
  );
}
