import { Sparkles } from "lucide-react";

const SAMPLE_QUERIES = [
  "cheap high protein veg food in bangalore",
  "light but filling breakfast",
  "spicy non-veg dinner under 400",
  "quinoa salad",
  "comfort food",
];

interface SuggestedQueriesProps {
  onPick: (query: string) => void;
  disabled: boolean;
}

export function SuggestedQueries({ onPick, disabled }: SuggestedQueriesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
        <Sparkles className="h-3.5 w-3.5" />
        Try one of these:
      </span>
      {SAMPLE_QUERIES.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          disabled={disabled}
          className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
