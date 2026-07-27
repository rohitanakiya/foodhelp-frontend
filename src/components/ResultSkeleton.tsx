/**
 * Placeholder cards shown while /chat/recommend is in flight.
 *
 * We mirror the shape of a real ResultCard so the layout doesn't
 * shift when the actual results arrive. Six placeholder cards match
 * the grid at wider viewports; on mobile the extras just wrap.
 */
export function ResultSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/70"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="absolute -top-2 -left-2 h-7 w-7 rounded-full bg-emerald-600/40" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBar className="h-5 w-3/4" />
              <SkeletonBar className="h-3 w-1/2" />
            </div>
            <SkeletonBar className="h-5 w-12 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SkeletonBar className="h-11 rounded-lg" />
            <SkeletonBar className="h-11 rounded-lg" />
            <SkeletonBar className="h-11 rounded-lg" />
          </div>
          <div className="space-y-1">
            <SkeletonBar className="h-3 w-full" />
            <SkeletonBar className="h-1.5 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 ${className}`}
    />
  );
}
