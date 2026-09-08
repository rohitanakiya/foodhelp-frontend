/**
 * Typed client for the KhanaDedo backend.
 *
 * Anonymous calls (like /chat/recommend without a JWT) still work —
 * they hit the seeded data path. When a JWT is stored via
 * setStoredToken(), it's injected as Bearer for every subsequent
 * request; the backend routes those through Swiggy MCP if the user
 * also has a stored Swiggy access token.
 */

export const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

// ── Token storage helpers (localStorage-backed) ──

const TOKEN_KEY = "khanadedo.jwt";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage disabled (private mode, quota, etc.). We continue without
    // persistence; the session survives until page reload.
  }
}

// ── Request helper ──

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!response.ok) {
    let body: ApiError | string;
    try {
      body = (await response.json()) as ApiError;
    } catch {
      body = await response.text();
    }
    const message =
      typeof body === "string"
        ? body
        : body.error ?? `Request failed (${response.status})`;
    const err = new Error(message) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  return (await response.json()) as T;
}

// ── Response types — mirror the backend ──

export interface ExtractedFilters {
  city?: string;
  veg?: boolean;
  vegan?: boolean;
  maxPrice?: number;
  minProtein?: number;
}

export interface Recommendation {
  itemName: string;
  /** Swiggy's menu_item_id — needed for add-to-cart calls. Undefined
   *  on seed items. */
  itemId?: string;
  price: string;
  protein?: number;
  calories?: number;
  restaurantName: string;
  restaurantId?: string;
  rating: string | null;
  isVeg?: boolean;
  isVegan?: boolean | null;
  description?: string;
  category?: string | null;
  swiggyUrl?: string | null;
  similarity: number | null;
  score: number;
  /** Groq-generated one-line reason this item earned its rank. */
  rationale?: string;
  /** True when protein/calories were LLM-estimated (Swiggy path), not
   *  measured (seed path). UI should mark them visibly as estimates. */
  nutritionEstimated?: boolean;
}

export interface Synthesis {
  summary: string;
  provider: "groq" | "none";
  fellBack?: boolean;
}

export interface RecommendResponse {
  source?: "seed" | "swiggy";
  provider: string;
  filterProvider?: "groq" | "regex";
  filterProviderFellBack?: boolean;
  synthesis?: Synthesis;
  filters: ExtractedFilters;
  addressLabel?: string;
  recommendations: Recommendation[];
  swiggyError?: string;
  needsAddress?: boolean;
  message?: string;
  note?: string;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User & { isActive?: boolean; createdAt?: string };
}

export interface SignupResponse {
  message: string;
  user: User & { createdAt?: string };
  apiKey?: { rawKey: string; keyId: string; note: string };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface SwiggyStatus {
  connected: boolean;
  expiresAt?: string;
  scope?: string;
}

export interface SwiggyAddress {
  addressId: string;
  label: string;
  formattedAddress: string;
  city: string;
}

export interface AddressListResponse {
  connected: boolean;
  addresses: SwiggyAddress[];
}

// ── Requests ──

export function recommendFood(
  text: string,
  addressId?: string
): Promise<RecommendResponse> {
  return request<RecommendResponse>("/chat/recommend", {
    method: "POST",
    body: JSON.stringify(addressId ? { text, addressId } : { text }),
  });
}

/** Lists the user's Swiggy addresses so the frontend can render a
 *  picker. Returns `{ connected: false, addresses: [] }` when the user
 *  isn't signed in or hasn't connected Swiggy — safe to call always. */
export function fetchSwiggyAddresses(): Promise<AddressListResponse> {
  return request<AddressListResponse>("/chat/addresses");
}

export interface AddToCartRequest {
  restaurantId: string;
  menuItemId: string;
  addressId?: string;
  restaurantName?: string;
}

export interface AddToCartResponse {
  ok: boolean;
  /** Present on success — Swiggy checkout URL to open in a new tab. */
  checkoutUrl?: string;
  message?: string;
  /** Present on failure when the item needs manual customization on
   *  Swiggy — the restaurant menu URL to fall back to. */
  fallbackMenuUrl?: string;
  needsSwiggy?: boolean;
}

/** Adds one item to the caller's Swiggy cart via our backend, which
 *  in turn calls Swiggy's `update_food_cart` MCP tool. The frontend
 *  should open `checkoutUrl` on success, or `fallbackMenuUrl` on
 *  failure (items with required variants can't be added blindly). */
export function addToSwiggyCart(
  body: AddToCartRequest
): Promise<AddToCartResponse> {
  return request<AddToCartResponse>("/chat/cart", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function signup(
  email: string,
  password: string,
  username?: string
): Promise<SignupResponse> {
  return request<SignupResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
}

export function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchProfile(): Promise<User> {
  return request<User>("/profile/me");
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(
  token: string,
  password: string
): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export function fetchSwiggyStatus(): Promise<SwiggyStatus> {
  return request<SwiggyStatus>("/auth/swiggy/status");
}

export function startSwiggyAuth(
  returnTo?: string
): Promise<{ authorizeUrl: string }> {
  return request<{ authorizeUrl: string }>("/auth/swiggy/start", {
    method: "POST",
    body: JSON.stringify(returnTo ? { returnTo } : {}),
  });
}

export function swiggyLogout(): Promise<{ disconnected: boolean }> {
  return request<{ disconnected: boolean }>("/auth/swiggy/logout", {
    method: "POST",
  });
}

/** Only available in local dev + when backend is running with SWIGGY_PROVIDER=mock. */
export function devFakeConnectSwiggy(): Promise<{
  connected: boolean;
  provider: string;
  note: string;
}> {
  return request<{ connected: boolean; provider: string; note: string }>(
    "/auth/swiggy/dev-fake-connect",
    { method: "POST" }
  );
}

export function isDevBackend(): boolean {
  return API_BASE.includes("localhost");
}
