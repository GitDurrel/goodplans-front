import type { Category, Filters, Listing } from "./types";

const API_BASE_URL = "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { accessToken?: string };
    if (!parsed?.accessToken) return {};
    return { Authorization: `Bearer ${parsed.accessToken}` };
  } catch {
    return {};
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");

  const authHeader = getAuthHeader();
  Object.entries(authHeader).forEach(([key, value]) => headers.set(key, value));

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function fetchRecentListings(filters: Filters): Promise<Listing[]> {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", "8");

  if (filters.category) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.city) params.set("city", filters.city);
  if (filters.region) params.set("region", filters.region);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.transactionType)
    params.set("transaction_type", filters.transactionType);

  return fetchJson<Listing[]>(`/listings?${params.toString()}`, { method: "GET" });
}

export async function fetchMostViewedListings(): Promise<Listing[]> {
  // ⚠️ Le backend ne propose pas encore de tri par vues ; on récupère simplement
  // la première page. À prioriser côté API pour fournir un classement.
  const params = new URLSearchParams({ page: "1", limit: "8" });
  return fetchJson<Listing[]>(`/listings?${params.toString()}`, { method: "GET" });
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>("/categories", { method: "GET" });
}
