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
      <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        <Sparkles className="h-3.5 w-3.5 text-saffron-500" />
        Try one of these:
      </span>
      {SAMPLE_QUERIES.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          disabled={disabled}
          className="rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-700 backdrop-blur-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
