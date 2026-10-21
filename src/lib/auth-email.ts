export function profileEmail(profile?: { email?: unknown; preferred_username?: unknown } | null) {
  const email = profile?.email ?? profile?.preferred_username;
  return typeof email === "string" && email.includes("@") ? email.toLowerCase() : undefined;
}
