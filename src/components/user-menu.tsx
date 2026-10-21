"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "@/components/avatar";

interface UserMenuProps {
  user: { name: string; email: string; avatarUrl: string; hasStats: boolean } | null;
  signOutAction: () => Promise<void>;
}

export function UserMenu({ user, signOutAction }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!user) {
    return (
      <span
        title="Not signed in"
        className="flex items-center gap-2 px-2 py-1 text-xs italic text-zinc-500"
      >
        Anonymous
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        title={user.email}
        className="flex items-center gap-2 px-2 py-1 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        <Avatar src={user.avatarUrl} size={20} />
        <span className="hidden sm:inline max-w-40 truncate text-xs">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl z-50 py-1">
          <div className="px-3 py-2 border-b border-zinc-800">
            <p className="text-xs font-medium text-zinc-200 truncate">{user.name}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
          </div>
          {user.hasStats && (
            <Link
              href={`/users/${encodeURIComponent(user.email)}`}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              My stats
            </Link>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
