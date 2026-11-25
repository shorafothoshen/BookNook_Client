import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, User } from "lucide-react";

import { BookType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export const metadata: Metadata = { title: "All Books" };

export default async function AllBooksPage() {
  let books: BookType[] = [];
  let errorMessage = "";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books`);
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Could not load the books.");
      }
      books = Array.isArray(result) ? result : (result?.books ?? []);
    }catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load the books.";
  }

  return (
    <main className="bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            All Books
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-orange-500" />
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Browse every book on the shelf and borrow your next read.
          </p>
        </div>

        {/* ---------- Content ---------- */}
        {errorMessage ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl bg-card p-8 text-center ring-1 ring-border">
            <p className="font-medium text-foreground">Could not load the books</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl bg-card px-6 py-14 text-center ring-1 ring-border">
            <span className="grid size-14 place-items-center rounded-2xl bg-orange-500/10 text-orange-500">
              <BookOpen className="size-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-bold">Please log in</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Log in to see all the books on the shelf.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/login?redirect=/books" />}
              className="mt-5 bg-orange-500 text-white hover:bg-orange-600"
            >
              Login
            </Button>
          </div>
        ) : errorMessage ? (
          <div className="mx-auto mt-10 max-w-md rounded-2xl bg-card p-8 text-center ring-1 ring-border">
            <p className="font-medium text-foreground">Could not load the books</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl bg-card px-6 py-14 text-center ring-1 ring-border">
            <span className="grid size-14 place-items-center rounded-2xl bg-orange-500/10 text-orange-500">
              <BookOpen className="size-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-bold">No books yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No book has been added yet. Please check again soon.
            </p>
          </div>
        ) : (
          /* ---------- Cards: 1 / 2 / 3 per row ---------- */
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {books.map((book) => (
              <Card
                key={book._id}
                className="group relative h-full gap-0 overflow-hidden rounded-2xl bg-card py-0 shadow-sm ring-1 ring-border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/10 hover:ring-orange-500/40"
              >
                {/* image: same size on every card */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                  <Badge className="absolute left-3 top-3 gap-1.5 border border-white/25 bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-md sm:left-4 sm:top-4">
                    <span className="size-1.5 rounded-full bg-orange-400" />
                    {book.category}
                  </Badge>
                </div>

                {/* title + author */}
                <CardContent className="flex flex-1 flex-col gap-3 px-5 pb-0 pt-5 sm:px-6 sm:pt-6">
                  <h2 className="line-clamp-1 font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-orange-500 sm:text-2xl">
                    {book.title}
                  </h2>
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

                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}