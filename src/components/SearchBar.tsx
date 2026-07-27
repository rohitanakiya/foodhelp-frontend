import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchBar({ onSubmit, isLoading, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      {/* Ambient focus glow */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-400/0 via-saffron-300/0 to-emerald-400/0 opacity-0 blur-xl transition-opacity duration-500",
          focused && "from-emerald-400/40 via-saffron-300/30 to-emerald-400/40 opacity-100"
        )}
      />

      <div
        className={cn(
          "relative flex items-center gap-2 rounded-2xl border bg-white/80 px-4 py-3 shadow-sm backdrop-blur-md transition",
          "border-gray-200 hover:border-gray-300",
          "focus-within:border-emerald-500 focus-within:shadow-md",
          "dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-gray-600"
        )}
      >
        <Search
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            focused
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-400 dark:text-gray-500"
          )}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder='Try "cheap high protein veg food in bangalore"'
          disabled={isLoading}
          className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed dark:text-gray-100 dark:placeholder:text-gray-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-medium transition",
            "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Search
            </>
          )}
        </button>
      </div>
    </form>
  );
}
