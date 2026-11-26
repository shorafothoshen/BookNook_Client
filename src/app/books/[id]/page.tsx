import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookDetails } from "@/lib/types";
import BorrowDialog from "@/components/BorrowDialog";

export const metadata: Metadata = { title: "Book Details" };

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let book: BookDetails | null = null;
  let errorMessage = "";
  let bookMissing = false;
  let user = { name: "", email: "" };

  try {
    const headerList = await headers();

    const jwt = await auth.api.getToken({ headers: headerList });
    const session = await auth.api.getSession({ headers: headerList });
    user = { name: session?.user.name ?? "", email: session?.user.email ?? "" };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`, {
      cache: "no-store",
      headers: { authorization: `Bearer ${jwt.token}` },
    });
    const result = await res.json().catch(() => null);

    if (res.status === 404 || res.status === 400) {
      bookMissing = true; // no book with this id
    } else if (!res.ok) {
      throw new Error(result?.message || "Could not load the book.");
    } else {
      book = result?.book ?? result;
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Could not load the book.";
  }

  // notFound() must run outside try/catch
  if (bookMissing) notFound();

  if (errorMessage || !book) {
    return (
      <main className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-md rounded-2xl bg-card p-8 text-center ring-1 ring-border">
          <p className="font-medium text-foreground">Could not load the book</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {errorMessage || "Please try again."}
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/books" />}
            className="mt-5 bg-orange-500 text-white hover:bg-orange-600"
          >
            Back to All Books
          </Button>
        </div>
      </main>
    );
  }

  const availableCopies = book.availableCopies ?? 0;
  const totalCopies = book.totalCopies ?? 0;
  const addedBy = book.userName || "Unknown";
  const addedOn = book.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <main className="bg-muted/30 py-10 sm:py-14">
      <title>{book.title}</title>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-orange-500"
        >
          <ArrowLeft className="size-4" />
          Back to All Books
        </Link>

        <div className="mt-6 grid gap-8 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-6 md:grid-cols-2 lg:gap-12 lg:p-8">
          {/* ---------- Image ---------- */}
          <div className="relative h-80 w-full overflow-hidden rounded-xl bg-muted sm:h-[26rem] md:h-auto md:min-h-[480px]">
            {/* soft blurred copy of the cover fills the background, so there are no empty bars */}
            <Image
              src={book.image}
              alt=""
              aria-hidden="true"
              fill
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
              className="scale-110 object-cover opacity-50 blur-2xl"
            />
            {/* the full cover, never cropped */}
            <Image
              src={book.image}
              alt={`Cover of ${book.title}`}
              fill
              priority
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain p-4 drop-shadow-2xl sm:p-6"
            />
          </div>

          {/* ---------- Info ---------- */}
          <div className="flex flex-col">
            <Badge className="w-fit border-transparent bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
              {book.category}
            </Badge>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              by <span className="font-medium text-foreground">{book.author}</span>
            </p>

            <Separator className="my-6" />

            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {book.description}
            </p>

            {/* details + copies + borrow button (shared state BorrowDialog er bhitore) */}
            <BorrowDialog
              bookId={id}
              title={book.title}
              initialAvailable={availableCopies}
              totalCopies={totalCopies}
              addedBy={addedBy}
              addedOn={addedOn}
              userName={user.name}
              userEmail={user.email}
            />
          </div>
        </div>
      </div>
    </main>
  );
}