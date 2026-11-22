import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Copy } from "lucide-react";

import { auth } from "@/lib/auth";
import { BookDetails } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "BookNook | Book Details" };

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let book: BookDetails | null = null;
  let errorMessage = "";
  let bookMissing = false;
  let needsLogin = false;
  let user = { name: "", email: "" };

  try {
    const headerList = await headers();

    // JWT and session of the logged in user (null when nobody is logged in)
    const jwt = await auth.api.getToken({ headers: headerList }).catch(() => null);
    const session = await auth.api.getSession({ headers: headerList }).catch(() => null);
    user = { name: session?.user.name ?? "", email: session?.user.email ?? "" };

    if (!jwt?.token) {
      needsLogin = true;
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${id}`, {
        method: "GET",
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
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Could not load the book.";
  }

  // redirect() and notFound() must run outside try/catch
  if (needsLogin) redirect(`/login?redirect=/books/${id}`);
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
  const available = availableCopies > 0;
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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted md:aspect-auto md:min-h-[420px]">
            <Image
              src={book.image}
              alt={`Cover of ${book.title}`}
              fill
              priority
              unoptimized
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
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
              by{" "}
              <span className="font-medium text-foreground">{book.author}</span>
            </p>

            <Separator className="my-6" />

            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {book.description}
            </p>

            {/* details */}
            <div className="mt-6 grid gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-orange-500 font-semibold text-white">
                    {addedBy.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Added by</p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {addedBy}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {book.userEmail}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4 text-orange-500" />
                  Added on{" "}
                  <span className="font-medium text-foreground">{addedOn}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Copy className="size-4 text-orange-500" />
                  <span className="font-medium text-foreground">
                    {availableCopies} of {totalCopies}
                  </span>{" "}
                  copies available
                </p>
              </div>
            </div>

            {/* ---------- Borrow button + modal ---------- */}
            <div className="mt-8">
              <Dialog>
                {/* when copies are 0 this button shows "Not Available" and is disabled */}
                <DialogTrigger
                  disabled={!available}
                  render={
                    <Button className="h-auto w-full rounded-xl border-transparent bg-orange-500 py-3 text-base font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-60 sm:w-auto sm:px-10" />
                  }
                >
                  {available ? "Borrow This Book" : "Not Available"}
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl">
                      Borrow this book
                    </DialogTitle>
                    <DialogDescription>
                      You are borrowing{" "}
                      <span className="font-medium text-foreground">{book.title}</span>{" "}
                      for a few days.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="borrowName">Your Name</Label>
                      <Input
                        id="borrowName"
                        defaultValue={user.name}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="borrowEmail">Your Email</Label>
                      <Input
                        id="borrowEmail"
                        defaultValue={user.email}
                        readOnly
                        className="bg-muted text-muted-foreground"
                      />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                      <DialogClose render={<Button type="button" variant="outline" />}>
                        Cancel
                      </DialogClose>
                      <Button
                        type="button"
                        className="bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Confirm Borrow
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}