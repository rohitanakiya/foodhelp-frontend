import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Utensils, AlertCircle } from "lucide-react";
import { recommendFood, type RecommendResponse } from "@/lib/api";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ResultCard } from "@/components/ResultCard";
import { SuggestedQueries } from "@/components/SuggestedQueries";

export function App() {
  // Track which query produced the visible results, so we can show
  // "Results for ..." even after the user starts typing a new search.
  const [activeQuery, setActiveQuery] = useState<string | null>(null);

  const mutation = useMutation<RecommendResponse, Error, string>({
    mutationFn: recommendFood,
  });

  const handleSearch = (text: string) => {
    setActiveQuery(text);
    mutation.mutate(text);
  };

  const data = mutation.data;
  const error = mutation.error;
  const isLoading = mutation.isPending;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AI Food Recommender
            </h1>
            <p className="text-xs text-gray-500">
              Semantic search over real menu data
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <SearchBar onSubmit={handleSearch} isLoading={isLoading} />

        <SuggestedQueries onPick={handleSearch} disabled={isLoading} />

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <div className="font-medium">Couldn't load recommendations</div>
              <div className="mt-1 text-red-700">{error.message}</div>
              <div className="mt-2 text-xs text-red-600">
                Make sure the food-backend is running on{" "}
                <code className="font-mono">http://localhost:4000</code> and that
                CORS includes <code className="font-mono">http://localhost:5173</code>.
              </div>
            </div>
          </div>
        )}

        {data && activeQuery && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Results for
                </p>
                <p className="text-base font-medium text-gray-900">
                  "{activeQuery}"
                </p>
              </div>
              <p className="text-xs text-gray-500">
                via {data.provider}
              </p>
            </div>

            <FilterChips filters={data.filters} />

            {data.recommendations.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-white p-8 text-center text-gray-500">
                No menu items match those filters. Try loosening them.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.recommendations.map((item, idx) => (
                  <ResultCard
                    key={`${item.restaurantName}-${item.itemName}`}
                    item={item}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {!data && !error && !isLoading && (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <Utensils className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">
              Search above to see semantic food recommendations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
