/**
 * Swiggy connection hooks. All server calls go through the API
 * client which auto-injects the JWT; these hooks are only useful
 * when the caller is authenticated.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  devFakeConnectSwiggy,
  fetchSwiggyAddresses,
  fetchSwiggyStatus,
  startSwiggyAuth,
  swiggyLogout,
  type AddressListResponse,
  type SwiggyStatus,
} from "./api";

const SWIGGY_STATUS_KEY = ["swiggyStatus"];
const SWIGGY_ADDRESSES_KEY = ["swiggyAddresses"];

/** Fetch the caller's Swiggy addresses. Gated on `enabled` (typically
 *  the user being signed in) so we don't hammer /chat/addresses for
 *  anonymous callers. */
export function useSwiggyAddresses(enabled: boolean) {
  return useQuery<AddressListResponse>({
    queryKey: SWIGGY_ADDRESSES_KEY,
    queryFn: fetchSwiggyAddresses,
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

/** Invalidate the cached address list so the next fetch is fresh.
 *  Used by the "Refresh" button after the user adds an address in the
 *  Swiggy app and comes back. */
export function useRefreshSwiggyAddresses() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: SWIGGY_ADDRESSES_KEY });
}

export function useSwiggyStatus(enabled: boolean) {
  return useQuery<SwiggyStatus>({
    queryKey: SWIGGY_STATUS_KEY,
    queryFn: fetchSwiggyStatus,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

/**
 * Kicks off the OAuth flow. On success the browser is redirected to
 * Swiggy's authorize URL — the current page unloads.
 */
export function useConnectSwiggy() {
  return useMutation({
    mutationFn: async () => {
      const { authorizeUrl } = await startSwiggyAuth(window.location.href);
      window.location.assign(authorizeUrl);
    },
  });
}

export function useDisconnectSwiggy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: swiggyLogout,
    onSuccess: () => {
      qc.setQueryData(SWIGGY_STATUS_KEY, { connected: false });
    },
  });
}

/** Dev-only. Backend refuses in production. */
export function useDevFakeConnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: devFakeConnectSwiggy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SWIGGY_STATUS_KEY });
    },
  });
}
