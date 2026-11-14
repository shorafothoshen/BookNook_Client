import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Copy } from "lucide-react";

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

// sample data, only for the design
const book = {
  title: "The Silent Garden",
  author: "Amina Rahman",
  category: "Fiction",
  image: "/books/book-1.jpg",
  description:
    "A quiet story about a woman who inherits an old garden and slowly learns the secrets hidden behind its walls. Warm, gentle and full of small surprises, it is a perfect book for a calm weekend.",
  addedBy: { name: "Rahim Uddin", email: "rahim@example.com" },
  addedOn: "12 November 2026",
  availableCopies: 3,
  totalCopies: 5,
};

// sample logged in user (shown inside the borrow modal)
const user = { name: "Nadia Karim", email: "nadia@example.com" };

export default function BookDetailsPage() {
  const available = book.availableCopies > 0;

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
                    {book.addedBy.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Added by</p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {book.addedBy.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {book.addedBy.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4 text-orange-500" />
                  Added on{" "}
                  <span className="font-medium text-foreground">{book.addedOn}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Copy className="size-4 text-orange-500" />
                  <span className="font-medium text-foreground">
                    {book.availableCopies} of {book.totalCopies}
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