import { Sparkles } from "lucide-react";

/**
 * Landing state for a fresh visitor — before they've submitted any
 * query. Sets expectations, shows the tagline as the punchline, and
 * hints at what to type without demanding a click.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cream-200 bg-white/70 p-8 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/60 sm:p-12">
      {/* Decorative saffron blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-saffron-300/40 blur-3xl dark:bg-saffron-500/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/15"
      />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-200">
          <Sparkles className="h-3 w-3" />
          AI food recommender
        </span>

        <h2 className="mt-5 max-w-2xl font-serif text-3xl italic leading-tight text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl">
          Stop scrolling. Start eating.
        </h2>

        <p className="mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          Tell KhanaDedo what you want in plain English — <em>cheap high-protein
          veg dinner</em>, or <em>something light for breakfast</em> — and get a
          ranked top-5 of nearby Swiggy options in seconds. Doomscroll khatam.
          Khana shuru.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <FeatureBadge label="Natural-language filters" />
          <FeatureBadge label="Semantic ranking" />
          <FeatureBadge label="Deep-link to Swiggy" />
        </div>
      </div>
    </section>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-xs text-gray-700 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
      {label}
    </div>
  );
}
