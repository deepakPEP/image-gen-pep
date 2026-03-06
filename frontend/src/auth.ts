const SESSION_KEY = "nano_replica_session";

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAuthenticated(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
