import { Sparkles } from "lucide-react";

/**
 * Attribution row shown above the result cards whenever `data.source
 * === "swiggy"`. Renders two pills:
 *
 *   1. "Powered by Swiggy" — attributes the source of the underlying
 *      restaurant and menu data. Must be visible wherever Swiggy data
 *      is shown to the end user.
 *   2. "Re-ranked by KhanaDedo" — transparency label. We do reorder
 *      Swiggy's default results based on the user's own stated
 *      constraints (protein, price, dietary), so we say so explicitly
 *      rather than presenting the ordering as Swiggy's.
 *
 * Both pills should stay visible on every Swiggy-backed response.
 */
export function SwiggyAttribution({ addressLabel }: { addressLabel?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 font-medium text-orange-800 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:ring-orange-800/60">
        <SwiggyMark />
        Powered by Swiggy
      </span>

      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800/60">
        <Sparkles className="h-3 w-3" />
        Re-ranked by KhanaDedo
      </span>

      {addressLabel && (
        <span className="text-gray-500 dark:text-gray-400">
          delivering to <span className="font-medium">{addressLabel}</span>
        </span>
      )}
    </div>
  );
}

/** Small Swiggy-orange mark. Kept minimal + geometric so we don't need
 *  Swiggy's actual brand asset (per Swiggy's brand-usage guidance,
 *  partners should not reproduce the wordmark without explicit
 *  approval — a simple color indicator is fine for attribution). */
function SwiggyMark() {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.25)]"
    />
  );
}
