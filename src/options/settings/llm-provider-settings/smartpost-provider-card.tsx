import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KODEPAY_PLAN_ID, OPTIONS_URL } from "@/lib/env";
import { getKodepayClient } from "@/lib/kodepay";
import { cn } from "@/lib/utils";
import { RoutePaths } from "@/options/route";
import type { LLMProvider } from "@/options/settings/llm-provider-settings/types";
import { UpgradeDialog } from "@/options/settings/llm-provider-settings/upgrade-dialog";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  useSession,
} from "@clerk/chrome-extension";
import { useState } from "react";
import { toast } from "sonner";

interface SmartpostProviderCardProps {
  provider: LLMProvider;
  isAvailable: boolean;
  onConfigure: (providerId: string) => void;
}

export function SmartpostProviderCard({
  provider,
  isAvailable,
  onConfigure,
}: SmartpostProviderCardProps) {
  const { isLoaded, session } = useSession();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  if (!isLoaded) return null;
  const isPro =
    isLoaded &&
    session?.user?.publicMetadata?.["subscription"]?.["endTime"] >
      Math.floor(Date.now() / 1000);

  const handlePaymentSuccess = async () => {
    // Show loading toast
    toast.loading("Refreshing page...");
    // Wait for 1 second before refreshing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Refresh the page
    window.location.reload();
  };

  async function handleUpgrade() {
    try {
      setShowUpgradeDialog(false);
      toast.loading("Processing payment...");
      const kodepay_client = getKodepayClient();
      kodepay_client.register_login_information(
        session.user.publicMetadata["kodePayUserKey"],
      );
      await kodepay_client.open_payment_page(KODEPAY_PLAN_ID);
      toast.dismiss();
      setShowPaymentConfirm(true);
    } catch (error) {
      console.error("Failed to process upgrade:", error);
      toast.error("Failed to open payment page. Please try again.");
    }
  }

  return (
    <div>
      <div className="sp-flex sp-items-center sp-justify-between sp-rounded-lg sp-border sp-p-4">
        <div className="sp-flex sp-items-center sp-space-x-4">
          <div className="sp-space-y-1">
            <div className="sp-flex sp-items-center sp-gap-2">
              <h4 className="sp-text-base sp-font-bold">{provider.name}</h4>
              <span
                className={cn(
                  "sp-text-sm",
                  isAvailable ? "sp-text-green-600" : "sp-text-red-600",
                )}
              >
                • {isAvailable ? "Connected" : "Not Connected"}
              </span>
              {isPro && (
                <span className="sp-text-sm">
                  Please select a model to continue.
                </span>
              )}
            </div>
            <p className="sp-text-secondary-foreground sp-text-sm">
              {provider.description}
            </p>
          </div>
        </div>
        <SignedOut>
          <SignInButton
            mode="modal"
            forceRedirectUrl={`${OPTIONS_URL}${RoutePaths.SETTINGS_LLM_PROVIDER}`}
          >
            <Button size="sm">Configure</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {isPro ? (
            <Button size="sm" onClick={() => onConfigure(provider.id)}>
              Configure
            </Button>
          ) : (
            <UpgradeDialog
              open={showUpgradeDialog}
              onOpenChange={setShowUpgradeDialog}
              onUpgrade={handleUpgrade}
            />
          )}
        </SignedIn>
      </div>

      <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
        <DialogContent className="sp-max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Confirmation</DialogTitle>
          </DialogHeader>
          <div className="sp-flex sp-flex-col sp-gap-4 sp-py-4">
            <p className="sp-text-center sp-text-sm sp-text-muted-foreground">
              Have you completed the payment successfully?
            </p>
            <div className="sp-flex sp-justify-center sp-gap-4">
              <Button
                variant="outline"
                onClick={() => setShowPaymentConfirm(false)}
              >
                No, Not Yet
              </Button>
              <Button onClick={handlePaymentSuccess}>
                Yes, Payment Successful
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
