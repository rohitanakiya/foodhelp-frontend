import { Info, LogIn } from "lucide-react";

interface DemoBannerProps {
  /** True when the user is signed in but has no Swiggy connection yet. */
  isSignedIn: boolean;
  /** Called when user clicks "Sign in" (opens the auth modal). */
  onSignIn: () => void;
  /** Called when user clicks "Connect Swiggy" (starts OAuth). Only used
   *  in the signed-in-but-no-Swiggy variant. */
  onConnectSwiggy?: () => void;
  /** Present when the seed fallback happened AFTER a live Swiggy call
   *  failed (network, 401, etc). Tells the user why they're seeing a
   *  demo result even though they connected Swiggy. */
  swiggyError?: string;
}

/**
 * Prominent banner shown at the top of results whenever `data.source
 * === "seed"`. Explains that the items on screen are hand-seeded sample
 * data, not real Swiggy restaurants, and offers the appropriate next
 * step depending on the user's auth state.
 *
 * Three variants:
 *   1. Anonymous  → "Sign in + connect Swiggy for real recommendations"
 *   2. Signed in  → "Connect Swiggy to see real restaurants near you"
 *   3. Fallback   → "Swiggy hiccupped — showing demo items in the meantime"
 */
export function DemoBanner({
  isSignedIn,
  onSignIn,
  onConnectSwiggy,
  swiggyError,
}: DemoBannerProps) {
  // Variant 3 — Swiggy path was tried and failed. Different tone: it's
  // not the user's fault, don't push them to reconnect if they already are.
  if (swiggyError) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">Showing demo items</div>
          <p className="mt-0.5 text-amber-800 dark:text-amber-200">
            Swiggy didn't respond in time — these are hand-seeded sample
            dishes, not real listings. Try your query again in a moment.
          </p>
        </div>
      </div>
    );
  }

  // Variant 1 or 2 — no live Swiggy path was attempted (anonymous, or
  // signed in without a Swiggy connection).
  return (
    <div className="rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 text-sm text-amber-900 dark:border-amber-800/60 dark:from-amber-950/50 dark:to-orange-950/40 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <div className="font-semibold">Demo mode — these aren't real restaurants</div>
          <p className="mt-0.5 text-amber-800 dark:text-amber-200">
            You're seeing hand-seeded sample dishes so you can try the
            ranking. To get real Swiggy restaurants and menus near you,
            {isSignedIn ? " connect your Swiggy account." : " sign in and connect Swiggy."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {isSignedIn ? (
              onConnectSwiggy && (
                <button
                  type="button"
                  onClick={onConnectSwiggy}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                  Connect Swiggy
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={onSignIn}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in to get real results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
