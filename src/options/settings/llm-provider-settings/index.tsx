import { useStorage } from "@/contexts/storage-context";
import { PROVIDERS } from "@/options/settings/llm-provider-settings/config";
import { ProviderConfigDialog } from "@/options/settings/llm-provider-settings/dialog";
import { ProviderCard } from "@/options/settings/llm-provider-settings/provider-card";
import { SmartpostProviderCard } from "@/options/settings/llm-provider-settings/smartpost-provider-card";
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
          const isSmartpost = provider.id === "smartpost-pro";
          return isSmartpost ? (
            <SmartpostProviderCard
              key={provider.id}
              provider={provider}
              isAvailable={storage.settings.providers[provider.id].available}
              onConfigure={() => setConfiguring(provider.id)}
            />
          ) : (
            <ProviderCard
              key={provider.id}
              provider={provider}
              isAvailable={storage.settings.providers[provider.id].available}
              onConfigure={() => setConfiguring(provider.id)}
            />
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
