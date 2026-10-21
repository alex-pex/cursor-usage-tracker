import { redirect } from "next/navigation";
import { auth, providerId, providerName, signIn } from "@/auth";
import { GoogleIcon } from "@/components/google-icon";
import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");

  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500" />

        <div className="px-8 pt-8 pb-6 text-center">
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="mx-auto mb-4"
            aria-hidden
          />
          <h1 className="text-xl font-bold text-white mb-1">Cursor Usage Tracker</h1>
          <p className="text-sm text-zinc-400">Sign in to access the dashboard</p>
        </div>

        <div className="px-8 pb-8">
          <form
            action={async () => {
              "use server";
              await signIn(providerId, { redirectTo: callbackUrl ?? "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-sm font-medium text-white bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 transition-all cursor-pointer"
            >
              {providerId === "google" && <GoogleIcon />}
              Sign in with {providerName}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
