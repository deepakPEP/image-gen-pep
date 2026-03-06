import axios from "axios";

/**
 * Backend API base URL.
 * Set VITE_API_BASE_URL in .env (e.g. http://localhost:8081).
 * Fallback: http://localhost:8000
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://localhost:8000";

/**
 * Optional API key sent to backend for request validation.
 * Set VITE_API_KEY in .env; must match backend API_KEY when backend enforces it.
 * Note: This value is visible in the client bundle; use for light protection only.
 */
export const API_KEY = (
  import.meta.env.VITE_API_KEY as string | undefined
)?.trim() || "";

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Axios instance with base URL and optional API key header */
export const api = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ""),
  headers: API_KEY ? { "X-API-Key": API_KEY } : {},
});
