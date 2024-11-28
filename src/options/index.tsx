import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { StorageProvider } from "@/contexts/storage-context";
import { CLERK_PUBLISHABLE_KEY, OPTIONS_URL } from "@/lib/env";
import { AppSidebar } from "@/options/app-sidebar";
import type { RouteKey } from "@/options/route";
import { DEFAULT_ROUTE, ROUTES_MAP } from "@/options/route";
import "@/style.css";
import { ClerkProvider } from "@clerk/chrome-extension";
import { useEffect, useState } from "react";

export default function Page() {
  const [currentPage, setCurrentPage] = useState<RouteKey>(DEFAULT_ROUTE);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || DEFAULT_ROUTE;
      setCurrentPage(
        ROUTES_MAP.hasOwnProperty(hash) ? (hash as RouteKey) : DEFAULT_ROUTE,
      );
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  const CurrentComponent = ROUTES_MAP[currentPage];
  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl={OPTIONS_URL}
      signInFallbackRedirectUrl={OPTIONS_URL}
      signUpFallbackRedirectUrl={OPTIONS_URL}
    >
      <StorageProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main className="sp-p-4">
              <CurrentComponent />
            </main>
            <Toaster richColors />
          </SidebarInset>
        </SidebarProvider>
      </StorageProvider>
    </ClerkProvider>
  );
}
