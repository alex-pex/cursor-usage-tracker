import { createHash } from "node:crypto";

export function gravatarUrl(email: string, size = 64) {
  const hash = createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
