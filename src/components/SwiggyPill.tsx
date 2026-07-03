import { CheckCircle2, ExternalLink, Loader2, Zap } from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { isDevBackend } from "@/lib/api";
import {
  useConnectSwiggy,
  useDevFakeConnect,
  useDisconnectSwiggy,
  useSwiggyStatus,
} from "@/lib/swiggy";
import { cn } from "@/lib/utils";

export function SwiggyPill() {
  const { data: user } = useCurrentUser();
  const status = useSwiggyStatus(!!user);
  const connect = useConnectSwiggy();
  const disconnect = useDisconnectSwiggy();
  const devFake = useDevFakeConnect();

  if (!user) return null;

  if (status.isPending && !status.data) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking Swiggy…
      </div>
    );
  }

  if (status.data?.connected) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-200">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Swiggy connected
        <button
          type="button"
          onClick={() => disconnect.mutate()}
          disabled={disconnect.isPending}
          className="ml-1 text-emerald-600 hover:underline disabled:opacity-60 dark:text-emerald-400"
        >
          {disconnect.isPending ? "…" : "disconnect"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => connect.mutate()}
        disabled={connect.isPending}
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 transition",
          "hover:border-emerald-300 hover:bg-emerald-50",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "dark:border-emerald-800/60 dark:bg-gray-900 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
        )}
      >
        {connect.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <ExternalLink className="h-3 w-3" />
        )}
        Connect Swiggy
      </button>

      {isDevBackend() && (
        <button
          type="button"
          onClick={() => devFake.mutate()}
          disabled={devFake.isPending}
          title="Dev only — inserts a mock Swiggy token so you can exercise the Swiggy path without approval"
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-600 transition",
            "hover:border-gray-400 hover:bg-gray-50",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
        >
          {devFake.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Zap className="h-3 w-3" />
          )}
          Dev: fake connect
        </button>
      )}
    </div>
  );
}
