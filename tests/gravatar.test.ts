import { describe, it, expect } from "vitest";
import { gravatarUrl } from "@/lib/gravatar";

describe("gravatarUrl", () => {
  it("hashes the trimmed, lower-cased email with SHA-256", () => {
    expect(gravatarUrl("MyEmailAddress@example.com ")).toBe(
      "https://www.gravatar.com/avatar/84059b07d4be67b806386c0aad8070a23f18836bbaae342275dc0a83414c32ee?s=64&d=identicon",
    );
    expect(gravatarUrl("myemailaddress@example.com")).toBe(
      gravatarUrl("MyEmailAddress@example.com "),
    );
  });

  it("uses the requested size", () => {
    expect(gravatarUrl("a@x.com", 96)).toContain("s=96");
  });
});
