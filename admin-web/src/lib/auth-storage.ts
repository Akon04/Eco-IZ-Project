import type { AuthSession } from "@/lib/types";

const SESSION_KEY = "ecoiz_admin_session";

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export function loadStoredSession(): AuthSession | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    storage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession(session: AuthSession) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(SESSION_KEY);
}
