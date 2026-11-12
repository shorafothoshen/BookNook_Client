"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { focusRing } from "./styles";

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click and on Escape.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#12203A] text-sm font-semibold text-[#F2B134] ring-2 ring-[#F2B134]/70 hover:ring-[#F2B134] dark:bg-[#F2B134] dark:text-[#12203A] ${focusRing}`}
      >
        {user.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-4 w-64 rounded-2xl border border-[#12203A]/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0E1627]">
          <div className="border-b border-[#12203A]/10 px-3 pb-3 pt-2 dark:border-white/10">
            <p className="truncate text-sm font-semibold text-[#12203A] dark:text-white">
              {user.name || "Reader"}
            </p>
            {user.email && (
              <p className="truncate text-xs text-[#12203A]/60 dark:text-slate-400">{user.email}</p>
            )}
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#12203A] transition-colors hover:bg-[#12203A]/5 dark:text-slate-100 dark:hover:bg-white/10 ${focusRing}`}
          >
            <UserRound className="h-4 w-4" aria-hidden />
            My Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${focusRing}`}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}