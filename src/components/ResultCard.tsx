import { useState } from "react";
import { Star, Flame, Beef, ArrowUpRight, MapPin, Loader2, Check, AlertCircle } from "lucide-react";
import type { Recommendation } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { useAddToSwiggyCart, useSwiggyStatus } from "@/lib/swiggy";
import { cn } from "@/lib/utils";

/** Same localStorage key the AddressPicker writes to. Reading it here
 *  avoids drilling addressId through 3 layers of props. */
const ADDRESS_STORAGE_KEY = "khanadedo.addressId";

interface ResultCardProps {
  item: Recommendation;
  rank: number;
}

export function ResultCard({ item, rank }: ResultCardProps) {
  const similarityPct = item.similarity ? Math.round(item.similarity * 100) : null;
  const ratingValue = item.rating ? Number.parseFloat(item.rating) : null;
  const priceValue = Number.parseFloat(item.price);
  const hasNutrition =
    typeof item.protein === "number" && typeof item.calories === "number";

  // Veg / non-veg tri-state. Swiggy sometimes omits it entirely.
  const vegState: "veg" | "nonveg" | "unknown" =
    item.isVegan || item.isVeg === true
      ? "veg"
      : item.isVeg === false
      ? "nonveg"
      : "unknown";

  // Left-accent + subtle top-right glow color, tied to veg state so the
  // card visually communicates diet at a glance.
  const accent =
    vegState === "veg"
      ? {
          leftBar:
            "before:bg-gradient-to-b before:from-emerald-500 before:to-emerald-400",
          hover:
            "hover:border-emerald-300 hover:shadow-emerald-500/10 dark:hover:border-emerald-700",
          glow:
            "from-emerald-100/40 via-transparent to-emerald-50/20 dark:from-emerald-500/10 dark:to-emerald-500/5",
        }
      : vegState === "nonveg"
      ? {
          leftBar:
            "before:bg-gradient-to-b before:from-rose-500 before:to-rose-400",
          hover:
            "hover:border-rose-300 hover:shadow-rose-500/10 dark:hover:border-rose-800",
          glow:
            "from-rose-100/40 via-transparent to-rose-50/20 dark:from-rose-500/10 dark:to-rose-500/5",
        }
      : {
          leftBar:
            "before:bg-gradient-to-b before:from-gray-300 before:to-gray-200 dark:before:from-gray-700 dark:before:to-gray-800",
          hover:
            "hover:border-gray-300 hover:shadow-gray-400/10 dark:hover:border-gray-700",
          glow:
            "from-gray-100/40 via-transparent to-transparent dark:from-gray-500/10 dark:to-gray-500/5",
        };

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-white/85 p-5 pl-7 pt-6 shadow-sm backdrop-blur-sm animate-fade-in-up",
        "border-gray-200 transition duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        "dark:border-gray-800 dark:bg-gray-900/70",
        // Left accent bar — 6px, full height, tied to veg state
        "before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:content-['']",
        accent.leftBar,
        accent.hover
      )}
      style={{
        animationDelay: `${(rank - 1) * 60}ms`,
        animationFillMode: "forwards",
      }}
    >
      {/* Ambient hover glow tinted by veg state */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          accent.glow
        )}
      />

      {/* Rank badge — inside the padding zone so overflow-hidden doesn't clip it */}
      <div className="absolute top-2 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:bg-white dark:text-gray-900 dark:ring-gray-900">
        {rank}
      </div>

      {/* Header: name + veg dot + rating */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <VegIndicator state={vegState} />
            <h3 className="truncate text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {item.itemName}
            </h3>
          </div>
          {item.restaurantName && item.restaurantName !== "Unknown" && (
            <p className="flex items-center gap-1 truncate text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3 shrink-0 opacity-60" />
              <span className="truncate">{item.restaurantName}</span>
            </p>
          )}
        </div>
        {ratingValue !== null && (
          <div
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium ring-1 ring-inset",
              ratingValue >= 4.3
                ? "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-200 dark:ring-emerald-800/60"
                : ratingValue >= 3.8
                ? "bg-yellow-100 text-yellow-800 ring-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:ring-yellow-800/60"
                : "bg-orange-100 text-orange-800 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:ring-orange-800/60"
            )}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            {ratingValue.toFixed(1)}
          </div>
        )}
      </div>

      {/* Body: nutrition stats when we have them; hero price + veg pill when not */}
      {hasNutrition ? (
        <div className="relative grid grid-cols-3 gap-2">
          <Stat label="Price" value={`₹${priceValue.toFixed(0)}`} />
          <Stat
            label={item.nutritionEstimated ? "Protein~" : "Protein"}
            value={`${item.protein}g`}
            icon={<Beef className="h-3.5 w-3.5" />}
            estimated={item.nutritionEstimated}
          />
          <Stat
            label={item.nutritionEstimated ? "Calories~" : "Calories"}
            value={`${item.calories}`}
            icon={<Flame className="h-3.5 w-3.5" />}
            estimated={item.nutritionEstimated}
          />
        </div>
      ) : (
        <div className="relative flex items-end justify-between gap-3 rounded-xl bg-gradient-to-br from-cream-100/70 to-cream-50/40 p-3 dark:from-gray-800/60 dark:to-gray-800/30">
          <div>
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Price
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{priceValue.toFixed(0)}
              </span>
            </div>
          </div>
          <VegPill state={vegState} />
        </div>
      )}

      {/* Semantic similarity bar (only when we have real embeddings) */}
      {similarityPct !== null && similarityPct > 0 && (
        <div className="relative space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Semantic match</span>
            <span className="font-medium">{similarityPct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700",
                similarityPct >= 35
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                  : similarityPct >= 20
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                  : "bg-gradient-to-r from-orange-500 to-orange-400"
              )}
              style={{ width: `${Math.min(100, similarityPct * 2)}%` }}
            />
          </div>
        </div>
      )}

      {/* Rationale (Groq-generated one-liner) */}
      {item.rationale && (
        <p
          className={cn(
            "relative rounded-lg border-l-2 px-3 py-2 text-xs italic",
            vegState === "veg"
              ? "border-emerald-400/60 bg-emerald-50/50 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-950/30 dark:text-emerald-100"
              : vegState === "nonveg"
              ? "border-rose-400/60 bg-rose-50/50 text-rose-900 dark:border-rose-500/50 dark:bg-rose-950/30 dark:text-rose-100"
              : "border-gray-300 bg-gray-50/50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/30 dark:text-gray-300"
          )}
        >
          {item.rationale}
        </p>
      )}

      {/* Cart / Order button — see CartButton for the two-mode logic */}
      <CartButton item={item} />
    </article>
  );
}

/**
 * Two-mode CTA at the bottom of every card:
 *   - "Add to Swiggy cart" — when the user is signed in AND connected
 *     to Swiggy AND the item came from Swiggy (has itemId + restaurantId).
 *     Clicking calls our /chat/cart endpoint which uses update_food_cart
 *     to actually add the item to the user's Swiggy cart, then opens
 *     swiggy.com/checkout in a new tab. If Swiggy rejects (item needs
 *     variants/addons the user must pick), we fall back to opening the
 *     menu page so the user can customize + add themselves.
 *   - "View on Swiggy" — for anonymous users, users without a Swiggy
 *     connection, or seed items. Just opens the URL we have.
 */
function CartButton({ item }: { item: Recommendation }) {
  const { data: user } = useCurrentUser();
  const { data: swiggyStatus } = useSwiggyStatus(!!user);
  const addToCart = useAddToSwiggyCart();
  const [openedUrl, setOpenedUrl] = useState<string | null>(null);

  const canAddToCart =
    !!user &&
    !!swiggyStatus?.connected &&
    !!item.itemId &&
    !!item.restaurantId &&
    item.restaurantId !== "unknown";

  if (!canAddToCart) {
    // Fallback: plain deep-link. No cart-add attempt.
    if (!item.swiggyUrl) return null;
    return (
      <a
        href={item.swiggyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "relative mt-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition",
          "bg-gradient-to-r from-orange-500 to-saffron-500",
          "hover:from-orange-600 hover:to-saffron-600 hover:shadow-md hover:shadow-orange-500/30",
          "active:scale-[0.98]"
        )}
      >
        View on Swiggy
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    );
  }

  const handleClick = async () => {
    // Read the current address selection at click time (not render time)
    // so a change in the picker takes effect immediately.
    let addressId: string | undefined;
    try {
      addressId = localStorage.getItem(ADDRESS_STORAGE_KEY) ?? undefined;
    } catch {
      /* storage blocked — backend falls back to default address */
    }

    try {
      const result = await addToCart.mutateAsync({
        restaurantId: item.restaurantId!,
        menuItemId: item.itemId!,
        addressId,
        restaurantName: item.restaurantName,
      });
      if (result.ok && result.checkoutUrl) {
        window.open(result.checkoutUrl, "_blank", "noopener,noreferrer");
        setOpenedUrl(result.checkoutUrl);
      } else if (result.fallbackMenuUrl) {
        // Add-to-cart failed (probably needs variants). Open the menu
        // page so the user can pick options + add manually.
        window.open(result.fallbackMenuUrl, "_blank", "noopener,noreferrer");
        setOpenedUrl(result.fallbackMenuUrl);
      }
    } catch {
      // Network / server error — fall back to the plain menu deep-link.
      if (item.swiggyUrl) {
        window.open(item.swiggyUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const isPending = addToCart.isPending;
  const succeeded = addToCart.isSuccess && addToCart.data?.ok;
  const failedButFallback =
    addToCart.isSuccess && !addToCart.data?.ok && addToCart.data?.fallbackMenuUrl;

  return (
    <div className="mt-1 space-y-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "relative flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition",
          "bg-gradient-to-r from-orange-500 to-saffron-500",
          "hover:from-orange-600 hover:to-saffron-600 hover:shadow-md hover:shadow-orange-500/30",
          "active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-80"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Adding to cart…
          </>
        ) : succeeded ? (
          <>
            <Check className="h-3.5 w-3.5" />
            Opened Swiggy checkout
          </>
        ) : (
          <>
            Add to Swiggy cart
            <ArrowUpRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>

      {failedButFallback && (
        <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          Needs customization — opened the menu on Swiggy so you can pick options.
        </p>
      )}

      {succeeded && openedUrl && (
        <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
          Cart didn't show up?{" "}
          <a
            href={openedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-orange-600"
          >
            Reopen Swiggy
          </a>
        </p>
      )}
    </div>
  );
}

/** FSSAI-style veg/non-veg indicator dot — an outlined square with a
 *  centered filled circle, green for veg, red for non-veg. */
function VegIndicator({ state }: { state: "veg" | "nonveg" | "unknown" }) {
  if (state === "unknown") return null;
  const isVeg = state === "veg";
  return (
    <span
      role="img"
      aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-[1.5px]",
        isVeg ? "border-emerald-600" : "border-rose-600"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isVeg ? "bg-emerald-600" : "bg-rose-600"
        )}
      />
    </span>
  );
}

/** Larger badge used in the hero-price row when we don't have macros. */
function VegPill({ state }: { state: "veg" | "nonveg" | "unknown" }) {
  if (state === "unknown") return null;
  const isVeg = state === "veg";
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        isVeg
          ? "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:ring-emerald-800/60"
          : "bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-rose-800/60"
      )}
    >
      <VegIndicator state={state} />
      {isVeg ? "Veg" : "Non-veg"}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  estimated = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  /** When true, the value came from LLM estimation, not a measurement.
   *  Rendered with a subtle dashed underline + tilde in the label. */
  estimated?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-2",
        estimated
          ? "bg-amber-50/70 dark:bg-amber-950/20"
          : "bg-cream-100/70 dark:bg-gray-800/60"
      )}
      title={estimated ? "Estimated from dish name" : undefined}
    >
      <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "mt-0.5 font-semibold text-gray-900 dark:text-gray-100",
          estimated && "underline decoration-dashed decoration-amber-500/60 underline-offset-2"
        )}
      >
        {value}
      </div>
    </div>
  );
}
