/**
 * Backend API base URL.
 * Set VITE_API_BASE_URL in .env (e.g. http://localhost:8081).
 * Fallback: http://localhost:8000
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "http://localhost:8000";

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
