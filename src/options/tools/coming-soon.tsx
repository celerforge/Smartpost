import { Button } from "@/components/ui/button";

export function ComingSoon() {
  return (
    <div className="sp-flex sp-flex-col sp-items-center sp-justify-center sp-space-y-4 sp-py-12">
      <div className="sp-space-y-2 sp-text-center">
        <h3 className="sp-text-2xl sp-font-bold">Coming Soon</h3>
        <p className="sp-text-muted-foreground">
          We're working hard to bring you new features. Stay tuned!
        </p>
      </div>

      <Button variant="outline" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
}
