import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

const getBooks = async (): Promise<Book[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/limit-books`, {
      cache: "force-cache",
    });
    if (!res.ok) throw new Error("Failed to load books");
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default async function BookCards() {
  const books = await getBooks();

  return (
    <section className="relative overflow-hidden bg-muted/30 py-14 sm:py-20 lg:py-24">
      {/* soft decorative glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3 text-orange-500">
            <span className="h-px w-8 bg-orange-500/60 sm:w-12" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">
              Fresh on the shelf
            </span>
            <span className="h-px w-8 bg-orange-500/60 sm:w-12" />
          </div>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            New Arrivals
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-orange-500" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            The latest books added by our readers. Pick one and borrow it for a
            few days.
          </p>
        </div>

        {books.length === 0 ? (
          /* ---------- Empty state ---------- */
          <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center rounded-2xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border sm:mt-14">
            <div className="flex size-14 items-center justify-center rounded-full bg-orange-500/10">
              <BookOpen className="size-7 text-orange-500" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-foreground">
              No books available yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              New books will show up here as soon as they are added. Please
              check back soon.
            </p>
          </div>
        ) : (
          /* ---------- Cards ---------- */
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {books.map((book, i) => (
              <Card
                key={book._id}
                className="group relative h-full gap-0 overflow-hidden rounded-2xl bg-card py-0 shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-orange-500/40"
              >
                {/* image: same ratio on every card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {book.image && (
                    <Image
                      src={book.image}
                      alt={`Cover of ${book.title}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      priority={i < 3}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                  {/* category (glass) */}
                  <Badge className="absolute left-3 top-3 gap-1.5 border border-white/25 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md sm:left-4 sm:top-4">
                    <span className="size-1.5 rounded-full bg-orange-400" />
                    {book.category}
                  </Badge>

                  {/* new tag */}
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-orange-500/30 sm:right-4 sm:top-4">
                    <Sparkles className="size-3" />
                    New
                  </span>
                </div>

                {/* text */}
                <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-0 pt-5 sm:px-6 sm:pt-6">
                  <h3 className="line-clamp-1 font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-orange-500 sm:text-2xl">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-orange-500/10 text-orange-500">
                      <User className="size-3.5" />
                    </span>
                    <span className="line-clamp-1">
                      by{" "}
                      <span className="font-medium text-foreground/80">
                        {book.author}
                      </span>
                    </span>
                  </div>
                </CardContent>

                {/* button */}
                <CardFooter className="border-t-0 bg-transparent px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
                  <Button
                    nativeButton={false}
                    render={<Link href={`/books/${book._id}`} />}
                    className="group/btn h-auto w-full rounded-xl border-transparent bg-orange-500 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600"
                  >
                    View Details
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardFooter>

                {/* bottom accent line on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Card>
            ))}
          </div>
        )}

        {/* ---------- See all ---------- */}
        <div className="mt-10 flex justify-center sm:mt-14">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/books" />}
            className="group/all h-auto w-full max-w-xs rounded-xl border-2 border-orange-500 bg-transparent px-8 py-3 text-base font-semibold text-orange-500 shadow-none hover:bg-orange-500 hover:text-white sm:w-auto"
          >
            See All Books
            <ArrowRight className="ml-2 size-5 transition-transform group-hover/all:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}