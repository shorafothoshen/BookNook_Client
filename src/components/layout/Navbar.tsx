"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookMarked, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { btnGhost, btnPrimary, focusRing, iconBtn } from "./styles";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/books", label: "All Books" },
];

// Shown only when the user is logged in.
const privateLinks = [
  { href: "/add-book", label: "Add Book" },
  { href: "/my-books", label: "My Books" },
  { href: "/my-borrows", label: "My Borrows" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Make the bar a bit stronger once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div
        className={`relative mx-auto flex h-16 max-w-7xl items-stretch justify-between gap-4 rounded-2xl border pl-3 pr-2 backdrop-blur-xl sm:pl-4 ${
          scrolled
            ? "border-[#12203A]/10 bg-white/85 shadow-[0_8px_30px_-12px_rgba(18,32,58,0.35)] dark:border-white/10 dark:bg-[#0E1627]/85"
            : "border-[#12203A]/5 bg-white/55 dark:border-white/5 dark:bg-[#0E1627]/55"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="BookNook home"
            className={`flex items-center gap-2.5 rounded-xl ${focusRing}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#12203A] text-[#F2B134] dark:bg-[#F2B134] dark:text-[#12203A]">
              <BookMarked className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="font-[family-name:var(--font-literata)] text-[1.35rem] font-semibold tracking-tight text-[#12203A] dark:text-white">
              BookNook
            </span>
          </Link>
        </div>

        {/* Desktop links: a small bookmark ribbon marks the current page */}
        <nav className="hidden lg:flex" aria-label="Main navigation">
          <ul className="flex h-full items-stretch">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  {active && (
                    <span className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
                      <span
                        className="h-4 w-3.5 bg-[#F2B134] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]"
                        aria-hidden
                      />
                    </span>
                  )}
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-full items-center px-4 text-sm font-medium transition-colors ${focusRing} ${
                      active
                        ? "text-[#12203A] dark:text-white"
                        : "text-[#12203A]/60 hover:text-[#12203A] dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {isPending ? (
            <div
              className="h-10 w-10 animate-pulse rounded-full bg-[#12203A]/10 dark:bg-white/10"
              aria-hidden
            />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className={btnGhost}>
                Login
              </Link>
              <Link href="/register" className={btnPrimary}>
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`${iconBtn} lg:hidden`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile / tablet menu */}
        {open && (
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-[#12203A]/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-[#0E1627] lg:hidden"
          >
            <ul className="flex flex-col">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors ${focusRing} ${
                        active
                          ? "bg-[#12203A]/5 text-[#12203A] dark:bg-white/10 dark:text-white"
                          : "text-[#12203A]/70 hover:bg-[#12203A]/5 dark:text-slate-300 dark:hover:bg-white/5"
                      }`}
                    >
                      {active && (
                        <span
                          className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[#F2B134]"
                          aria-hidden
                        />
                      )}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {!user && !isPending && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#12203A]/10 p-2 pt-3 dark:border-white/10 sm:hidden">
                <Link href="/login" className={btnGhost}>
                  Login
                </Link>
                <Link href="/register" className={btnPrimary}>
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}