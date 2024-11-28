import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export function UpgradeDialog({
  open,
  onOpenChange,
  onUpgrade,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      await onUpgrade();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Configure</Button>
      </DialogTrigger>
      <DialogContent
        className="sp-max-w-2xl"
        onPointerDownOutside={(e) => {
          if (!isLoading) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="sp-text-xl sp-font-bold">
            <div className="sp-flex sp-items-center sp-gap-2">
              <Sparkles className="sp-w-6 sp-h-6 sp-text-blue-500" />
              Upgrade to Smartpost Pro
            </div>
          </DialogTitle>

          <div className="sp-mt-4 sp-text-center sp-pb-4">
            <div className="sp-flex sp-items-baseline sp-justify-center sp-gap-2 sp-py-4">
              <span className="sp-text-3xl sp-font-bold">$18.99</span>
              <span className="sp-text-gray-600">/month</span>
            </div>
          </div>

          <section className="sp-mt-4 sp-space-y-4">
            <h3 className="sp-font-semibold sp-text-lg sp-flex sp-items-center sp-gap-2">
              <Zap className="sp-w-5 sp-h-5 sp-text-yellow-500" />
              Access Premium AI Models
            </h3>
            <div className="sp-grid sp-grid-cols-2 sp-gap-4">
              <article className="sp-rounded-lg sp-border sp-p-4">
                <div className="sp-flex sp-items-center sp-gap-2 sp-mb-2">
                  <span className="sp-font-semibold">GPT-4o Mini</span>
                  <span className="sp-bg-blue-100 sp-text-blue-700 sp-px-2 sp-py-0.5 sp-rounded-full sp-text-xs">
                    OpenAI
                  </span>
                </div>
                <div className="sp-text-sm sp-text-gray-600">
                  Optimized for fast responses with GPT-4 level intelligence.
                  Perfect for quick content generation and edits.
                </div>
              </article>
              <article className="sp-rounded-lg sp-border sp-p-4">
                <div className="sp-flex sp-items-center sp-gap-2 sp-mb-2">
                  <span className="sp-font-semibold">Claude 3 Haiku</span>
                  <span className="sp-bg-purple-100 sp-text-purple-700 sp-px-2 sp-py-0.5 sp-rounded-full sp-text-xs">
                    Anthropic
                  </span>
                </div>
                <div className="sp-text-sm sp-text-gray-600">
                  Latest AI model with enhanced understanding and creative
                  capabilities. Ideal for detailed content creation.
                </div>
              </article>
            </div>

            <div className="sp-mt-6 sp-space-y-3">
              <h3 className="sp-font-semibold sp-text-lg">
                Pro Subscription Benefits
              </h3>
              <ul className="sp-space-y-2">
                <li className="sp-flex sp-items-center sp-gap-2">
                  <Check className="sp-w-5 sp-h-5 sp-text-green-500" />
                  <span>
                    10,000 AI requests per month (~ $0.002 per request)
                  </span>
                </li>
                <li className="sp-flex sp-items-center sp-gap-2">
                  <Check className="sp-w-5 sp-h-5 sp-text-green-500" />
                  <span>Freely switch between both premium models</span>
                </li>
                <li className="sp-flex sp-items-center sp-gap-2">
                  <Check className="sp-w-5 sp-h-5 sp-text-green-500" />
                  <span>
                    No API keys needed - just subscribe and start using
                  </span>
                </li>
              </ul>
            </div>

            <div className="sp-mt-6 sp-flex sp-flex-col sp-items-center sp-gap-4">
              <Button
                className="sp-w-full sp-max-w-md"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading}
                autoFocus={false}
              >
                {isLoading ? (
                  <div className="sp-animate-spin sp-mr-2">⚪</div>
                ) : (
                  <Sparkles className="sp-w-4 sp-h-4 sp-mr-2" />
                )}
                {isLoading ? "Processing..." : "Upgrade Now for $18.99/month"}
              </Button>
            </div>
          </section>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
