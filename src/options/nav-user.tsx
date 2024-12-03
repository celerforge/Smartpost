import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useSession,
} from "@clerk/chrome-extension";

export function NavUser() {
  const { isLoaded, session } = useSession();
  const isPro =
    isLoaded &&
    session?.user?.publicMetadata?.["subscription"]?.["endTime"] >
      Math.floor(Date.now() / 1000);

  if (!isLoaded) return null;

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="sp-flex sp-items-center sp-gap-3 sp-rounded-lg sp-bg-zinc-50 sp-p-2">
          <UserButton />
          <div className="sp-flex sp-flex-1 sp-flex-col">
            <span className="sp-text-sm sp-font-medium sp-text-zinc-900 dark:sp-text-zinc-100">
              {session?.user?.username || session?.user?.firstName || "User"}
            </span>
            <span className="sp-text-xs sp-text-zinc-500 dark:sp-text-zinc-400">
              {session?.user?.emailAddresses[0]?.emailAddress}
            </span>
          </div>
          {isPro && (
            <span className="sp-inline-flex sp-h-5 sp-items-center sp-rounded-md sp-bg-black sp-px-2.5 sp-text-[11px] sp-font-medium sp-text-white dark:sp-bg-zinc-900">
              PRO
            </span>
          )}
        </div>
      </SignedIn>
    </>
  );
}
