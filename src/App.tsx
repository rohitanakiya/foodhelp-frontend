import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Utensils, AlertCircle, LogIn } from "lucide-react";
import { API_BASE, recommendFood, type RecommendResponse } from "@/lib/api";
import { useCurrentUser } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";
import { FilterChips } from "@/components/FilterChips";
import { ResultCard } from "@/components/ResultCard";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { SuggestedQueries } from "@/components/SuggestedQueries";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthModal } from "@/components/AuthModal";
import { ResetPasswordModal } from "@/components/ResetPasswordModal";
import { UserMenu } from "@/components/UserMenu";
import { SwiggyPill } from "@/components/SwiggyPill";
import { SwiggyReviewNotice } from "@/components/SwiggyReviewNotice";
import { SwiggyAttribution } from "@/components/SwiggyAttribution";
import { Hero } from "@/components/Hero";

export function App() {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();

  // Handle URL-driven flows on mount: ?swiggy=connected (OAuth
  // return) and ?reset=TOKEN (password reset link from email).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const swiggyParam = params.get("swiggy");
    const resetParam = params.get("reset");

    if (swiggyParam === "connected") {
      qc.invalidateQueries({ queryKey: ["swiggyStatus"] });
    }
    if (resetParam) {
      setResetToken(resetParam);
    }

    if (swiggyParam || resetParam) {
      params.delete("swiggy");
      params.delete("reset");
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
      <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
            <Utensils className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-serif text-2xl italic leading-none text-gray-900 dark:text-gray-100">
              KhanaDedo
            </h1>
            <p className="mt-1 hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
              Doomscroll khatam. Khana shuru.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SwiggyPill />
            </div>
            <ThemeToggle />
            {user ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm transition hover:border-emerald-300 hover:text-emerald-700 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
          </div>
        </div>

        {/* Swiggy pill on its own row on mobile so it doesn't wrap the header */}
        <div className="mx-auto flex max-w-4xl items-center justify-end px-4 pb-2 sm:hidden">
          <SwiggyPill />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 space-y-6 sm:py-8">
        <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
        <SuggestedQueries onPick={handleSearch} disabled={isLoading} />

        <SwiggyReviewNotice />

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

        {isLoading && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Cooking up results for
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  "{activeQuery}"
                </p>
              </div>
            </div>
            <ResultSkeleton />
          </section>
        )}

        {data && activeQuery && !isLoading && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Results for
                </p>
                <p className="truncate text-base font-medium text-gray-900 dark:text-gray-100">
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

            {/* Swiggy source + re-rank attribution. See
                SwiggyAttribution.tsx. Only shown when the response was
                actually served from Swiggy data. */}
            {data.source === "swiggy" && (
              <SwiggyAttribution addressLabel={data.addressLabel} />
            )}

            <FilterChips filters={data.filters} />

            {data.synthesis?.summary && (
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-saffron-50 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/40 dark:from-emerald-950/40 dark:via-gray-900 dark:to-saffron-950/30 dark:text-emerald-100">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  KhanaDedo says
                </div>
                <p className="leading-relaxed">{data.synthesis.summary}</p>
              </div>
            )}

            {data.recommendations.length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center dark:border-gray-700 dark:bg-gray-900/70">
                <div className="mb-4 text-4xl">🥲</div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nothing matched those filters.
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Try loosening a constraint or searching a different vibe.
                </p>
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

        {!data && !error && !isLoading && <Hero />}
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-8 pt-4 text-center text-xs text-gray-400 dark:text-gray-600">
        <p>
          Restaurant &amp; menu data <span className="font-medium">powered by Swiggy</span>.
          Results re-ranked by KhanaDedo against your stated preferences.
        </p>
        <p className="mt-1 opacity-70">
          Built with local Transformers.js embeddings and Groq LLM intent extraction.
        </p>
      </footer>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ResetPasswordModal
        open={!!resetToken}
        token={resetToken ?? ""}
        onClose={() => setResetToken(null)}
      />
    </div>
  );
}
