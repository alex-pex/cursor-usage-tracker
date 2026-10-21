import { describe, expect, it } from "vitest";
import { profileEmail } from "@/lib/auth-email";

describe("profileEmail", () => {
  it("prefers email and lowercases", () => {
    expect(profileEmail({ email: "A@B.com", preferred_username: "x@y.com" })).toBe("a@b.com");
  });
  it("falls back to preferred_username (Entra UPN)", () => {
    expect(profileEmail({ preferred_username: "Prenom.Nom@Boite.com" })).toBe(
      "prenom.nom@boite.com",
    );
  });
  it("returns undefined without a usable email", () => {
    expect(profileEmail({ preferred_username: "not-an-email" })).toBeUndefined();
    expect(profileEmail(null)).toBeUndefined();
  });
});
