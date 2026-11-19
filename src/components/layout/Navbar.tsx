"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Bounce, toast, type ToastOptions } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];
const privateLinks = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const BookIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
    <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
  </svg>
);

const loginBtn =
  "rounded-lg border-white/20 bg-transparent px-4 text-sm font-medium text-white shadow-none hover:border-orange-400 hover:bg-transparent hover:text-orange-400";
const registerBtn =
  "rounded-lg border-transparent bg-orange-500 px-4 text-sm font-semibold text-white shadow-none hover:bg-orange-600";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // private links are shown only when the user is logged in
  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setMenuOpen(false);
      toast.success("You have been logged out.", toastOptions);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again.", toastOptions);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1b1f2a]">
      <Collapsible open={menuOpen} onOpenChange={setMenuOpen}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
              <BookIcon />
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              BookNook
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "text-orange-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute inset-x-0 -bottom-[13px] h-0.5 rounded bg-orange-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isPending ? (
              <span
                className="size-10 animate-pulse rounded-full bg-white/10"
                aria-hidden="true"
              />
            ) : user ? (
              /* Avatar + dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open user menu"
                  className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-orange-500">
                    <AvatarImage src={user.image ?? undefined} alt={user.name} />
                    <AvatarFallback className="bg-orange-500 font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-60 overflow-hidden rounded-xl border border-white/10 bg-[#232836] p-0 text-slate-200 shadow-2xl ring-0"
                >
                  {/* plain div (Base UI's group label needs a Group parent) */}
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image ?? undefined} alt="" />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuItem
                    render={<Link href="/profile" />}
                    className="cursor-pointer rounded-none px-4 py-2.5 text-sm text-slate-200 focus:bg-white/5 focus:text-white"
                  >
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-none border-t border-white/10 px-4 py-2.5 text-sm font-medium text-orange-400 focus:bg-white/5 focus:text-orange-400"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Login / Register (hidden on very small screens, shown inside mobile menu) */
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/login" />}
                  className={loginBtn}
                >
                  Login
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/sign-up" />}
                  className={registerBtn}
                >
                  Register
                </Button>
              </div>
            )}

            {/* Hamburger */}
            <CollapsibleTrigger
              aria-label="Toggle menu"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg text-white transition hover:bg-white/10 lg:hidden"
            >
              <Menu className="size-6" />
            </CollapsibleTrigger>
          </div>
        </nav>

        {/* Mobile / tablet panel */}
        <CollapsibleContent className="border-t border-white/10 bg-[#1b1f2a] lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-base font-medium transition ${
                    isActive(href)
                      ? "bg-orange-500/15 text-orange-400"
                      : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}

            {!isPending && !user && (
              <li className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:hidden">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/login" onClick={() => setMenuOpen(false)} />}
                  className="h-auto rounded-lg border-white/20 bg-transparent px-4 py-2.5 text-sm font-medium text-white shadow-none hover:bg-white/5 hover:text-white"
                >
                  Login
                </Button>
                <Button
                  nativeButton={false}
                  render={<Link href="/sign-up" onClick={() => setMenuOpen(false)} />}
                  className="h-auto rounded-lg border-transparent bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-none hover:bg-orange-600"
                >
                  Register
                </Button>
              </li>
            )}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </header>
  );
}