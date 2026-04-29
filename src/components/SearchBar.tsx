import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchBar({ onSubmit, isLoading, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 shadow-sm transition",
          "focus-within:border-emerald-500 focus-within:shadow-md"
        )}
      >
        <Search className="h-5 w-5 shrink-0 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Try "cheap high protein veg food in bangalore"'
          disabled={isLoading}
          className="flex-1 bg-transparent text-base outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
          autoFocus
        />
        <button
          type="submit"
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-medium transition",
            "bg-emerald-600 text-white hover:bg-emerald-700",
            "disabled:cursor-not-allowed disabled:bg-gray-300"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>
    </form>
  );
}
