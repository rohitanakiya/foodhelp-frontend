/**
 * Typed client for the ai-food-backend.
 *
 * v1 hits the food-backend directly on http://localhost:4000 since
 * /chat/recommend doesn't require auth. When we layer on auth, this
 * is the single place to swap in /gw/* via the rate-limiter and add
 * the X-API-Key header.
 */

const API_BASE =
  import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

// ── Response types — mirror the food-backend's chat.service.ts ──

export interface ExtractedFilters {
  city?: string;
  veg?: boolean;
  maxPrice?: number;
  minProtein?: number;
}

export interface Recommendation {
  itemName: string;
  price: string; // pg returns NUMERIC as string
  protein: number;
  calories: number;
  restaurantName: string;
  rating: string | null;
  similarity: number | null;
  score: number;
}

export interface RecommendResponse {
  provider: string;
  filters: ExtractedFilters;
  recommendations: Recommendation[];
  note?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

// ── Request ───────────────────────────────────────────────────

export async function recommendFood(text: string): Promise<RecommendResponse> {
  const response = await fetch(`${API_BASE}/chat/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

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
    throw new Error(message);
  }

  return (await response.json()) as RecommendResponse;
}
