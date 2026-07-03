/**
 * Swiggy connection hooks. All server calls go through the API
 * client which auto-injects the JWT; these hooks are only useful
 * when the caller is authenticated.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  devFakeConnectSwiggy,
  fetchSwiggyStatus,
  startSwiggyAuth,
  swiggyLogout,
  type SwiggyStatus,
} from "./api";

const SWIGGY_STATUS_KEY = ["swiggyStatus"];

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
