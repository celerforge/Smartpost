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
      className={`hover:bg-x-primary/10 flex h-9 w-9 items-center justify-center rounded-full ${
        loading ? "cursor-not-allowed opacity-50" : ""
      }`}
      title="Optimize Post"
    >
      <WandSparkles
        className={`relative top-[0.5px] h-[18px] w-[18px] ${
          loading ? "animate-spin-slow" : ""
        }`}
      />
    </button>
  );
}
