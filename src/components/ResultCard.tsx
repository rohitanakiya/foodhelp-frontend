import { Star, Flame, Beef, IndianRupee, ArrowUpRight } from "lucide-react";
import type { Recommendation } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  item: Recommendation;
  rank: number;
}

export function ResultCard({ item, rank }: ResultCardProps) {
  const similarityPct = item.similarity ? Math.round(item.similarity * 100) : null;
  const ratingValue = item.rating ? Number.parseFloat(item.rating) : null;
  const hasNutrition =
    typeof item.protein === "number" && typeof item.calories === "number";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur-sm animate-fade-in-up",
        "border-gray-200 transition duration-300",
        "hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/5",
        "dark:border-gray-800 dark:bg-gray-900/70 dark:hover:border-emerald-700 dark:hover:shadow-emerald-500/10"
      )}
      style={{
        animationDelay: `${(rank - 1) * 60}ms`,
        animationFillMode: "forwards",
      }}
    >
      {/* Warm accent ring on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-saffron-200/0 via-transparent to-emerald-200/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-saffron-500/10 dark:to-emerald-500/10"
      />

      <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-md ring-2 ring-white dark:ring-gray-900">
        {rank}
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-100">
            {item.itemName}
          </h3>
          <p className="truncate text-sm text-gray-600 dark:text-gray-400">
            {item.restaurantName}
          </p>
        </div>
        {ratingValue !== null && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:ring-yellow-800/60">
            <Star className="h-3.5 w-3.5 fill-current" />
            {ratingValue.toFixed(1)}
          </div>
        )}
      </div>

      <div className="relative grid grid-cols-3 gap-2 text-sm">
        <Stat
          icon={<IndianRupee className="h-4 w-4" />}
          label="Price"
          value={`₹${Number.parseFloat(item.price).toFixed(0)}`}
        />
        {hasNutrition ? (
          <>
            <Stat
              icon={<Beef className="h-4 w-4" />}
              label="Protein"
              value={`${item.protein}g`}
            />
            <Stat
              icon={<Flame className="h-4 w-4" />}
              label="Calories"
              value={`${item.calories}`}
            />
          </>
        ) : (
          <div className="col-span-2 flex items-center rounded-lg bg-gray-50 p-2 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
            <span className="line-clamp-2">
              {item.description ?? "From Swiggy"}
            </span>
          </div>
        )}
      </div>

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

      {item.rationale && (
        <p className="relative text-xs italic text-gray-600 dark:text-gray-400 border-l-2 border-emerald-400/60 pl-2 dark:border-emerald-500/50">
          {item.rationale}
        </p>
      )}

      {item.swiggyUrl && (
        <a
          href={item.swiggyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "relative mt-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white transition",
            "bg-gradient-to-r from-orange-500 to-saffron-500",
            "hover:from-orange-600 hover:to-saffron-600 hover:shadow-md hover:shadow-orange-500/30",
            "active:scale-[0.98]"
          )}
        >
          Order on Swiggy
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </article>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-cream-100/70 p-2 dark:bg-gray-800/60">
      <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}
