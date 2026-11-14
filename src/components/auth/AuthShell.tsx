/**
 * BookNook — shared layout for Login + Register (DESIGN ONLY)
 *
 * shadcn components: Card
 * Place at: src/components/auth/AuthShell.tsx
 * Left image: uses /image-2.jpg from your public/ folder (change if you like)
 */

import Image from "next/image";
import { BookOpen, BookPlus, RotateCcw } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/* shared input style so both pages match */
export const inputClass =
  "h-11 rounded-lg border-border bg-background pl-10 text-sm focus-visible:border-orange-500 focus-visible:ring-orange-500/30";

/* shared icon style that sits inside inputs */
export const inputIconClass =
  "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground";

/* Google "G" logo */
export function GoogleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7.3 5.7c4.3-4 6.9-9.9 6.9-16.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/* card that holds the form */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-md gap-0 rounded-2xl bg-card py-0 shadow-xl ring-1 ring-border">
      <CardContent className="p-6 sm:p-8">{children}</CardContent>
    </Card>
  );
}

const points = [
  { icon: BookPlus, text: "Add the books you love" },
  { icon: BookOpen, text: "Borrow a book for a few days" },
  { icon: RotateCcw, text: "Return it when you are done" },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* ---------- Left: image panel (hidden on mobile / tablet) ---------- */}
      <aside className="relative hidden overflow-hidden bg-[#1b1f2a] lg:block">
        <Image
          src="/image-2.jpg"
          alt=""
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1b1f2a]/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1f2a] via-[#1b1f2a]/40 to-[#1b1f2a]/70" />
        <div className="absolute -left-24 top-1/3 size-80 rounded-full bg-orange-500/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-end p-10 xl:p-14">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-orange-300 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-orange-400" />
            BookNook
          </span>
          <h2 className="max-w-md font-serif text-3xl font-bold leading-tight text-white xl:text-4xl">
            Your next story is one <span className="text-orange-400">borrow</span> away.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-200">
                <span className="grid size-9 place-items-center rounded-lg bg-orange-500/15 text-orange-400 ring-1 ring-orange-400/30">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm xl:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ---------- Right: form ---------- */}
      <section className="relative flex items-center justify-center overflow-hidden bg-muted/30 px-4 py-10 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="relative flex w-full justify-center">{children}</div>
      </section>
    </main>
  );
}