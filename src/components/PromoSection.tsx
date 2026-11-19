import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const btn =
  "group/btn h-auto rounded-lg border-transparent bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600";

export default function PromoSection() {
  return (
    <section className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          {/* ---------- Big card ---------- */}
          <article className="relative overflow-hidden rounded-3xl bg-orange-100 p-6 text-slate-900 sm:p-10 md:col-span-2 lg:row-span-2">
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-orange-300/40 blur-3xl" />

            <div className="relative flex h-full flex-col-reverse items-center gap-8 sm:flex-row sm:gap-6">
              <div className="flex-1 text-center sm:text-left">
                <span className="text-sm font-semibold text-orange-600">
                  Explore The Collection
                </span>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Discover Your
                  <br />
                  Favorite Book
                </h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:mx-0 sm:text-base">
                  From stories that carry you away to facts that spark your
                  curiosity, find a book you will love and borrow it for a few
                  days.
                </p>
                <Button
                  nativeButton={false}
                  render={<Link href="/books" />}
                  className={`${btn} mt-7`}
                >
                  Browse Books
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>

              <Image
                src="/promo/promo-stack.png"
                alt="A stack of four books"
                width={600}
                height={480}
                className="w-56 shrink-0 object-contain drop-shadow-xl sm:w-64 lg:w-80 xl:w-96"
              />
            </div>
          </article>

          {/* ---------- Small card 1 ---------- */}
          <article className="relative overflow-hidden rounded-3xl bg-amber-100 p-6 text-slate-900 sm:p-8">
            <div className="relative flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-orange-600">
                  Share Your Shelf
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold leading-snug sm:text-2xl">
                  A book is a window to the world
                </h3>
                <Button
                  nativeButton={false}
                  render={<Link href="/add-book" />}
                  className={`${btn} mt-5`}
                >
                  Add Book
                </Button>
              </div>
              <Image
                src="/promo/promo-books-1.png"
                alt="A stack of three books"
                width={600}
                height={480}
                className="w-28 shrink-0 object-contain drop-shadow-lg sm:w-36 lg:w-32 xl:w-40"
              />
            </div>
          </article>

          {/* ---------- Small card 2 ---------- */}
          <article className="relative overflow-hidden rounded-3xl bg-rose-100 p-6 text-slate-900 sm:p-8">
            <div className="relative flex h-full items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-orange-600">
                  Keep It Simple
                </span>
                <h3 className="mt-2 font-serif text-xl font-bold leading-snug sm:text-2xl">
                  Borrow today, return in a few days
                </h3>
                <Button
                  nativeButton={false}
                  render={<Link href="/my-borrows" />}
                  className={`${btn} mt-5`}
                >
                  My Borrows
                </Button>
              </div>
              <Image
                src="/promo/promo-books-2.png"
                alt="A stack of two books"
                width={600}
                height={480}
                className="w-28 shrink-0 object-contain drop-shadow-lg sm:w-36 lg:w-32 xl:w-40"
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}