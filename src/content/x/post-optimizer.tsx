import { useSettings } from "@/contexts/settings-context";
import { enhancePost } from "@/lib/ai";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function XPostOptimizer() {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const textElement = document.querySelector(
      'span[data-text="true"]',
    ) as HTMLElement;
    if (textElement) {
      console.debug(`enhancing ${textElement.textContent}...`);
      await enhancePost(textElement.textContent, settings)
        .then((text) => {
          textElement.textContent = text;
          textElement.click();
          textElement.dispatchEvent(new Event("input", { bubbles: true }));
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`sp-hover:bg-x-primary/10 sp-flex sp-h-9 sp-w-9 sp-items-center sp-justify-center sp-rounded-full ${
        loading ? "sp-cursor-not-allowed sp-opacity-50" : ""
      }`}
      title="Optimize Post"
    >
      <WandSparkles
        className={`sp-relative sp-top-[0.5px] sp-h-[18px] sp-w-[18px] ${
          loading ? "sp-animate-spin-slow" : ""
        }`}
      />
    </button>
  );
}
