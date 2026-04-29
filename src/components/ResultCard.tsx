import { Star, Flame, Beef, IndianRupee } from "lucide-react";
import type { Recommendation } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  item: Recommendation;
  rank: number;
}

export function ResultCard({ item, rank }: ResultCardProps) {
  const similarityPct = item.similarity ? Math.round(item.similarity * 100) : null;
  const ratingValue = item.rating ? Number.parseFloat(item.rating) : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md">
      <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow">
        {rank}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {item.itemName}
          </h3>
          <p className="truncate text-sm text-gray-600">{item.restaurantName}</p>
        </div>
        {ratingValue !== null && (
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-800 ring-1 ring-inset ring-yellow-200">
            <Star className="h-3.5 w-3.5 fill-current" />
            {ratingValue.toFixed(1)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-sm">
        <Stat
          icon={<IndianRupee className="h-4 w-4" />}
          label="Price"
          value={`₹${Number.parseFloat(item.price).toFixed(0)}`}
        />
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
      </div>

      {similarityPct !== null && similarityPct > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Semantic match</span>
            <span className="font-medium">{similarityPct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                similarityPct >= 35
                  ? "bg-emerald-500"
                  : similarityPct >= 20
                    ? "bg-yellow-500"
                    : "bg-orange-400"
              )}
              style={{ width: `${Math.min(100, similarityPct * 2)}%` }}
            />
          </div>
        </div>
      )}
    </div>
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
    <div className="rounded-lg bg-gray-50 p-2">
      <div className="flex items-center gap-1 text-xs uppercase tracking-wide text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="mt-0.5 font-semibold text-gray-900">{value}</div>
    </div>
  );
}
