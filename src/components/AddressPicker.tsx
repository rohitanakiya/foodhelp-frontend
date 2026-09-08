import { useEffect, useState } from "react";
import { MapPin, RefreshCw, ExternalLink, ChevronDown, Check } from "lucide-react";
import { useSwiggyAddresses, useRefreshSwiggyAddresses } from "@/lib/swiggy";
import { cn } from "@/lib/utils";

/** localStorage key for the user's picked addressId. Persisted across
 *  page loads so a switched city sticks. */
const STORAGE_KEY = "khanadedo.addressId";

interface AddressPickerProps {
  /** True when the user is signed in — picker is hidden otherwise. */
  enabled: boolean;
  /** Called whenever the user picks an address (or when the initial
   *  selection is resolved). Parent forwards this to recommend() as
   *  the addressId param. */
  onChange: (addressId: string | null) => void;
}

/**
 * Dropdown letting the user pick which of their Swiggy addresses the
 * next query should search around. Also exposes a Refresh button
 * (re-fetches the list after the user adds an address in the Swiggy
 * app) and an "Add on Swiggy" link that opens Swiggy's site in a new
 * tab — Swiggy MCP doesn't expose an add_address tool, so this is the
 * cleanest workflow.
 */
export function AddressPicker({ enabled, onChange }: AddressPickerProps) {
  const { data, isLoading } = useSwiggyAddresses(enabled);
  const refresh = useRefreshSwiggyAddresses();
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [open, setOpen] = useState(false);

  const addresses = data?.addresses ?? [];

  // Once addresses arrive, reconcile the selection. If the persisted
  // id no longer exists (user deleted an address on Swiggy), fall back
  // to Swiggy's first (most-recent) address.
  useEffect(() => {
    if (!addresses.length) return;
    const persisted = addresses.find((a) => a.addressId === selectedId);
    const next = persisted ?? addresses[0];
    if (next.addressId !== selectedId) {
      setSelectedId(next.addressId);
      persist(next.addressId);
    }
    onChange(next.addressId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses.length]);

  function persist(id: string | null) {
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage blocked — memory-only selection is fine
    }
  }

  function pick(id: string) {
    setSelectedId(id);
    persist(id);
    onChange(id);
    setOpen(false);
  }

  if (!enabled || !data?.connected) return null;

  const selected =
    addresses.find((a) => a.addressId === selectedId) ?? addresses[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isLoading || addresses.length === 0}
        className={cn(
          "flex max-w-[220px] items-center gap-1.5 rounded-xl border border-gray-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-sm transition",
          "hover:border-orange-300 hover:text-orange-700",
          "dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:border-orange-500 dark:hover:text-orange-400",
          "disabled:cursor-not-allowed disabled:opacity-60"
        )}
        title={selected?.formattedAddress ?? "Loading addresses..."}
      >
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {isLoading
            ? "Loading..."
            : addresses.length === 0
            ? "No addresses"
            : selected?.label || "Address"}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          {/* Click-outside catcher */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div className="absolute right-0 top-full z-40 mt-1.5 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:text-gray-400">
              Delivering to
            </div>

            <div className="max-h-72 overflow-y-auto py-1">
              {addresses.map((a) => {
                const isSelected = a.addressId === selectedId;
                return (
                  <button
                    key={a.addressId}
                    type="button"
                    onClick={() => pick(a.addressId)}
                    className={cn(
                      "flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition",
                      isSelected
                        ? "bg-orange-50 text-orange-900 dark:bg-orange-950/40 dark:text-orange-100"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                    )}
                  >
                    <MapPin
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        isSelected
                          ? "text-orange-500"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate font-medium">{a.label}</span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                        )}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                        {a.formattedAddress}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-stretch gap-1 border-t border-gray-100 bg-gray-50/60 p-1.5 dark:border-gray-800 dark:bg-gray-900/60">
              <button
                type="button"
                onClick={() => {
                  refresh();
                  setOpen(false);
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
              <a
                href="https://www.swiggy.com/my-account"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-orange-600 transition hover:bg-white hover:text-orange-700 dark:text-orange-400 dark:hover:bg-gray-800 dark:hover:text-orange-300"
                title="Add a new address in Swiggy, then come back and hit Refresh"
              >
                Add on Swiggy
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
