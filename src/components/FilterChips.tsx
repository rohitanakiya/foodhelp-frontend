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
      className: "bg-blue-100 text-blue-800 ring-blue-200",
    });
  }
  if (filters.veg !== undefined) {
    chips.push(
      filters.veg
        ? { label: "🥬 Veg", className: "bg-green-100 text-green-800 ring-green-200" }
        : { label: "🍗 Non-veg", className: "bg-orange-100 text-orange-800 ring-orange-200" }
    );
  }
  if (filters.maxPrice !== undefined) {
    chips.push({
      label: `💰 ≤ ₹${filters.maxPrice}`,
      className: "bg-amber-100 text-amber-800 ring-amber-200",
    });
  }
  if (filters.minProtein !== undefined) {
    chips.push({
      label: `💪 ≥ ${filters.minProtein}g protein`,
      className: "bg-purple-100 text-purple-800 ring-purple-200",
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
      <p className="text-sm text-gray-500">
        No specific filters extracted from your query. Showing semantic best matches.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-gray-600">Detected:</span>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${chip.className}`}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}
