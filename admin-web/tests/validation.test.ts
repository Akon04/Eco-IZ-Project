import { describe, expect, it } from "vitest";

import { loginSchema, userFormSchema } from "../src/lib/validation";

describe("validation schemas", () => {
  it("rejects invalid login input", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });

  it("accepts valid admin moderation form input", () => {
    const result = userFormSchema.safeParse({
      role: "MODERATOR",
      status: "ACTIVE",
      adminNote: "Role reviewed manually",
    });

    expect(result.success).toBe(true);
  });
});
