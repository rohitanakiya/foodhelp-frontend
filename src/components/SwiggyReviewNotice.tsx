import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { useSwiggyStatus } from "@/lib/swiggy";

/**
 * Persistent notice shown above the search area when the current user
 * is logged in but not yet connected to Swiggy. Explains the review
 * status so anyone testing "Connect Swiggy" doesn't hit the Swiggy
 * "not whitelisted" page cold.
 *
 * Dismissible per browser (localStorage) so a returning user isn't
 * reminded every visit. Automatically hides once Swiggy connects.
 */
export function SwiggyReviewNotice() {
  const { data: user } = useCurrentUser();
  const status = useSwiggyStatus(!!user);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem("khanadedo.reviewNoticeDismissed") === "1");
    } catch {
      /* storage disabled — always show */
    }
  }, []);

  if (!user || status.data?.connected || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("khanadedo.reviewNoticeDismissed", "1");
    } catch {
      /* fine */
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
      <Clock className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">Swiggy integration currently in review</p>
        <p className="mt-1 text-amber-800/90 dark:text-amber-300/90">
          KhanaDedo is awaiting whitelist approval from Swiggy Builders Club
          (
          <a
            href="https://github.com/Swiggy/swiggy-mcp-server-manifest/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-amber-950 dark:hover:text-amber-100"
          >
            request tracked here
          </a>
          ). Until approval lands, all queries run against a small seeded demo
          dataset. Clicking "Connect Swiggy" will show Swiggy's not-whitelisted
          page — expected, not broken.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="rounded-lg p-1 text-amber-700 transition hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
        aria-label="Dismiss notice"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
