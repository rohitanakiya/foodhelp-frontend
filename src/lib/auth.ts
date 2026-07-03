/**
 * Auth hooks. JWT stored in localStorage; user profile fetched on
 * demand via /profile/me. Login/signup mutations update the stored
 * token and invalidate the user query so the UI reflects the new
 * state immediately.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfile,
  getStoredToken,
  login as loginRequest,
  setStoredToken,
  signup as signupRequest,
  type User,
} from "./api";

const USER_QUERY_KEY = ["currentUser"];

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
      if (!getStoredToken()) return null;
      try {
        return await fetchProfile();
      } catch (err) {
        const status = (err as { status?: number }).status;
        // 401/403 means the stored token is stale — clear it.
        if (status === 401 || status === 403) {
          setStoredToken(null);
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const res = await loginRequest(vars.email, vars.password);
      setStoredToken(res.token);
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["swiggyStatus"] });
    },
  });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      email: string;
      password: string;
      username?: string;
    }) => {
      await signupRequest(vars.email, vars.password, vars.username);
      // Signup doesn't issue a token — automatically log in for a
      // smooth first-time UX.
      const login = await loginRequest(vars.email, vars.password);
      setStoredToken(login.token);
      return login;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["swiggyStatus"] });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return () => {
    setStoredToken(null);
    qc.setQueryData(USER_QUERY_KEY, null);
    qc.setQueryData(["swiggyStatus"], { connected: false });
    // Wipe every query so we don't leak previous user's data.
    qc.clear();
  };
}
