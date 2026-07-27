import type { ExtractedFilters } from "@/lib/api";

interface FilterChipsProps {
  filters: ExtractedFilters;
}

interface Chip {
  label: string;
  className: string;
}

function buildChips(filters: ExtractedFilters): Chip[] {
  const chips: Chip[] = [];

  if (filters.city) {
    chips.push({
      label: `📍 ${cap(filters.city)}`,
      className:
        "bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:ring-blue-800/60",
    });
  }
  if (filters.vegan) {
    chips.push({
      label: "🌱 Vegan",
      className:
        "bg-teal-100 text-teal-800 ring-teal-200 dark:bg-teal-950/50 dark:text-teal-200 dark:ring-teal-800/60",
    });
  } else if (filters.veg !== undefined) {
    chips.push(
      filters.veg
        ? {
            label: "🥬 Veg",
            className:
              "bg-green-100 text-green-800 ring-green-200 dark:bg-green-950/50 dark:text-green-200 dark:ring-green-800/60",
          }
        : {
            label: "🍗 Non-veg",
            className:
              "bg-orange-100 text-orange-800 ring-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:ring-orange-800/60",
          }
    );
  }
  if (filters.maxPrice !== undefined) {
    chips.push({
      label: `💰 ≤ ₹${filters.maxPrice}`,
      className:
        "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800/60",
    });
  }
  if (filters.minProtein !== undefined) {
    chips.push({
      label: `💪 ≥ ${filters.minProtein}g protein`,
      className:
        "bg-purple-100 text-purple-800 ring-purple-200 dark:bg-purple-950/50 dark:text-purple-200 dark:ring-purple-800/60",
    });
  }

  return chips;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function FilterChips({ filters }: FilterChipsProps) {
  const chips = buildChips(filters);
  if (chips.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
        No specific filters extracted from your query. Showing semantic best matches.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
        Detected:
      </span>
      {chips.map((chip, i) => (
        <span
          key={chip.label}
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset animate-fade-in-up ${chip.className}`}
          style={{
            animationDelay: `${60 + i * 55}ms`,
            animationFillMode: "forwards",
          }}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}
