import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Utensils, AlertCircle, LogIn } from "lucide-react";
import { API_BASE, recommendFood, type RecommendResponse } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ResultCard } from "@/components/ResultCard";
import { SuggestedQueries } from "@/components/SuggestedQueries";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/AuthModal";
import { UserMenu } from "@/components/UserMenu";
import { SwiggyPill } from "@/components/SwiggyPill";

export function App() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();

  // Handle the ?swiggy=connected redirect from the backend callback.
  // We refresh the status query and clean the URL so a page reload
  // doesn't re-trigger the effect.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const swiggyParam = params.get("swiggy");
    if (swiggyParam) {
      if (swiggyParam === "connected") {
        qc.invalidateQueries({ queryKey: ["swiggyStatus"] });
      }
      params.delete("swiggy");
      const cleaned =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "") +
        window.location.hash;
      window.history.replaceState({}, "", cleaned);
    }
  }, [qc]);

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
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              KhanaDedo
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Doomscroll khatam. Khana shuru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SwiggyPill />
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
        <SuggestedQueries onPick={handleSearch} disabled={isLoading} />

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <div className="font-medium">Couldn't load recommendations</div>
              <div className="mt-1 text-red-700 dark:text-red-400">{error.message}</div>
              <div className="mt-2 text-xs text-red-600 dark:text-red-400/80">
                Tried to reach <code className="font-mono">{API_BASE}</code>. If this is the
                Render free-tier API, the first request after idle can take ~30s while the
                service wakes up — try again in a moment.
              </div>
            </div>
          </div>
        )}

        {data && activeQuery && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Results for
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  "{activeQuery}"
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  via {data.provider}
                  {data.filterProvider && ` + ${data.filterProvider}`}
                  {data.filterProviderFellBack && " (fallback)"}
                </p>
                {data.source && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    source:{" "}
                    {data.source === "swiggy" && data.addressLabel
                      ? `Swiggy (${data.addressLabel})`
                      : data.source}
                    {data.swiggyError && " — fallback to seed"}
                  </p>
                )}
              </div>
            </div>

            <FilterChips filters={data.filters} />

            {data.recommendations.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
                No menu items match those filters. Try loosening them.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {data.recommendations.map((item, idx) => (
                  <ResultCard
                    key={`${item.restaurantName}-${item.itemName}-${idx}`}
                    item={item}
                    rank={idx + 1}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {!data && !error && !isLoading && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
            <Utensils className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Search above to see semantic food recommendations.
            </p>
          </div>
        )}
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
