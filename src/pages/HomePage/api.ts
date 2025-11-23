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

type ListingsResponseShape =
  | Listing[]
  | {
      data?: Listing[] | { items?: Listing[] };
      items?: Listing[];
      results?: Listing[];
      listings?: Listing[];
      records?: Listing[];
      content?: Listing[];
    };

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) return images.filter((img): img is string => typeof img === "string");
  if (typeof images === "string" && images.trim().length > 0) return [images];
  return [];
}

function extractListings(payload: ListingsResponseShape): Listing[] {
  if (Array.isArray(payload)) {
    return payload.map((listing) => ({
      ...listing,
      images: normalizeImages((listing as Listing).images),
    }));
  }

  const candidates: unknown[] = [];
  if (payload.items) candidates.push(payload.items);
  if (payload.results) candidates.push(payload.results);
  if (payload.listings) candidates.push(payload.listings);
  if (payload.records) candidates.push(payload.records);
  if (payload.content) candidates.push(payload.content);

  if (payload.data) {
    candidates.push(payload.data);
    if (typeof payload.data === "object" && payload.data && "items" in payload.data) {
      candidates.push((payload.data as { items?: Listing[] }).items);
    }
  }

  const firstArray = candidates.find((candidate) => Array.isArray(candidate)) as Listing[] | undefined;
  if (!firstArray) return [];

  return firstArray.map((listing) => ({
    ...listing,
    images: normalizeImages((listing as Listing).images),
  }));
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

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

function buildFilterParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.category) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.city) params.set("city", filters.city);
  if (filters.region) params.set("region", filters.region);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.transaction_type)
    params.set("transaction_type", filters.transaction_type);

  return params;
}

async function fetchListingsFromApi(path: string): Promise<Listing[]> {
  try {
    const payload = await fetchJson<ListingsResponseShape>(path, { method: "GET" });
    return extractListings(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Listings request failed for ${path}`, error);
    return [];
  }
}

export async function fetchRecentListings(filters: Filters): Promise<Listing[]> {
  const base = buildFilterParams(filters);
  const path = base.toString() ? `/listings?${base.toString()}` : "/listings";
  return fetchListingsFromApi(path);
}

export async function fetchMostViewedListings(): Promise<Listing[]> {
  const listings = await fetchListingsFromApi("/listings");
  return listings
    .slice()
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 8);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchJson<Category[]>("/categories", { method: "GET" });
}
