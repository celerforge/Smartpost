import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LLMProvider } from "@/options/settings/llm-provider-settings/types";

interface ProviderCardProps {
  provider: LLMProvider;
  isAvailable: boolean;
  onConfigure: (providerId: string) => void;
}

export function ProviderCard({
  provider,
  isAvailable,
  onConfigure,
}: ProviderCardProps) {
  return (
    <div className="sp-flex sp-items-center sp-justify-between sp-rounded-lg sp-border sp-p-4">
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
        onClick={() => onConfigure(provider.id)}
      >
        Configure
      </Button>
    </div>
  );
}
