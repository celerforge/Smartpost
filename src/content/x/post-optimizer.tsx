import { ToolbarButton } from "@/content/toolbar-button";
import { getXPostTextElement, updateXPostText } from "@/content/x/dom";
import { useStorage } from "@/contexts/storage-context";
import { enhancePost } from "@/lib/ai";
import { OPTIONS_URL } from "@/lib/env";
import { RoutePaths } from "@/options/route";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function XPostOptimizer() {
  const { storage } = useStorage();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    try {
      if (
        !storage.settings.general.activeProvider ||
        !storage.settings.providers[storage.settings.general.activeProvider]
          .available
      ) {
        toast.error(
          `Please configure and select an LLM provider in the options page.`,
          {
            action: {
              label: "Configure",
              onClick: () =>
                window.open(
                  `${OPTIONS_URL}${RoutePaths.SETTINGS_LLM_PROVIDER}`,
                ),
            },
          },
        );
        return;
      }

      const textElement = getXPostTextElement();
      const enhancedText = await enhancePost(
        textElement.textContent,
        storage.settings,
      );
      console.debug(`Enhanced text: ${enhancedText}`);
      updateXPostText(enhancedText);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to enhance post.";
      console.error(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolbarButton
      onClick={handleClick}
      disabled={loading}
      title="Optimize Post"
      loading={loading}
      icon={
        <WandSparkles
          className={`sp-relative sp-top-[0.5px] sp-h-[18px] sp-w-[18px] ${
            loading ? "sp-animate-spin-slow" : ""
          }`}
        />
      }
    />
  );
}
