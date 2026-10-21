import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import Google from "next-auth/providers/google";
import Keycloak from "next-auth/providers/keycloak";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Okta from "next-auth/providers/okta";

export function profileEmail(profile?: { email?: unknown; preferred_username?: unknown } | null) {
  const email = profile?.email ?? profile?.preferred_username;
  return typeof email === "string" && email.includes("@") ? email.toLowerCase() : undefined;
}

const providers = {
  google: { provider: Google, name: "Google" },
  "microsoft-entra-id": { provider: MicrosoftEntraID, name: "Microsoft" },
  github: { provider: GitHub, name: "GitHub" },
  gitlab: { provider: GitLab, name: "GitLab" },
  okta: { provider: Okta, name: "Okta" },
  keycloak: { provider: Keycloak, name: "Keycloak" },
  auth0: { provider: Auth0, name: "Auth0" },
};

export const providerId = process.env.AUTH_PROVIDER?.trim() || "google";
if (!(providerId in providers)) {
  throw new Error(
    `Unknown AUTH_PROVIDER "${providerId}". Valid values: ${Object.keys(providers).join(", ")}`,
  );
}
if (providerId === "microsoft-entra-id" && !process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER) {
  throw new Error(
    "AUTH_MICROSOFT_ENTRA_ID_ISSUER is required for microsoft-entra-id, e.g. https://login.microsoftonline.com/<tenant-id>/v2.0/",
  );
}
export const providerName = providers[providerId as keyof typeof providers].name;

const allowedDomain = process.env.AUTH_ALLOWED_DOMAIN?.toLowerCase().trim();
const allowedEmails = process.env.AUTH_ALLOWED_EMAILS?.split(",")
  .map((e) => e.toLowerCase().trim())
  .filter(Boolean);

async function isGithubEmailVerified(email: string, token?: string | null) {
  if (!token) return false;
  const res = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${token}`, "User-Agent": "cursor-usage-tracker" },
  });
  if (!res.ok) return false;
  const emails = (await res.json()) as { email: string; verified: boolean }[];
  return emails.some((e) => e.verified && e.email.toLowerCase() === email);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [providers[providerId as keyof typeof providers].provider],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile, account }) {
      const email = profileEmail(profile);
      if (!email) return false;
      if (profile?.email_verified === false) return false;
      if (providerId === "github" && !(await isGithubEmailVerified(email, account?.access_token))) {
        return false;
      }
      if (allowedEmails?.length && allowedEmails.includes(email)) return true;
      if (allowedDomain && email.endsWith(`@${allowedDomain}`)) return true;
      if (!allowedEmails?.length && !allowedDomain) return true;
      return false;
    },
    jwt({ token, profile }) {
      const email = profileEmail(profile);
      if (email) token.email = email;
      return token;
    },
  },
});
