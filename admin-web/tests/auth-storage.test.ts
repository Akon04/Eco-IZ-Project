// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import {
  clearStoredSession,
  loadStoredSession,
  storeSession,
} from "../src/lib/auth-storage";

describe("auth storage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("stores and restores the admin session from sessionStorage", () => {
    const session = {
      token: "session-token",
      user: {
        id: "admin-1",
        email: "admin@ecoiz.app",
        username: "admin",
        role: "ADMIN",
      },
    };

    storeSession(session);

    expect(window.sessionStorage.getItem("ecoiz_admin_session")).toContain("session-token");
    expect(loadStoredSession()).toEqual(session);
  });

  it("clears invalid or removed session values", () => {
    window.sessionStorage.setItem("ecoiz_admin_session", "{broken");

    expect(loadStoredSession()).toBeNull();
    expect(window.sessionStorage.getItem("ecoiz_admin_session")).toBeNull();

    storeSession({
      token: "other-token",
      user: {
        id: "admin-2",
        email: "moderator@ecoiz.app",
        username: "moderator",
        role: "MODERATOR",
      },
    });
    clearStoredSession();

    expect(loadStoredSession()).toBeNull();
  });
});
