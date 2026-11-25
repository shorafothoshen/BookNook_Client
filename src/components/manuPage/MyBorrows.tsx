"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck, CalendarDays } from "lucide-react";
import { Bounce, toast, type ToastOptions } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Borrow } from "@/lib/types";
import ReturnButton from "@/components/borrowButton";
import Loading from "@/app/my-borrows/loading";

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

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// borrow date ta jekono field name e ashle-o kaj korbe
const getBorrowDate = (b: Borrow) => b.borrowedDate ?? b.borrowDate ?? b.createdAt;

// return date par hoye gele true
const isOverdue = (value?: string) => {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
};

// kotodin baki ba kotodin late
const daysLeft = (value?: string) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
};

function StatusBadge({ value }: { value?: string }) {
  const days = daysLeft(value);
  if (days === null) return null;

  if (days < 0) {
    return (
      <span className="inline-flex w-fit items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold text-red-600">
        Overdue by {Math.abs(days)} {Math.abs(days) === 1 ? "day" : "days"}
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="inline-flex w-fit items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
        Due today
      </span>
    );
  }
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
      {days} {days === 1 ? "day" : "days"} left
    </span>
  );
}

function BookCover({
  src,
  title,
  width,
  height,
  className,
}: {
  src?: string;
  title: string;
  width: number;
  height: number;
  className: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        style={{ width, height }}
        className={`grid shrink-0 place-items-center bg-orange-500/10 text-orange-500 ${className}`}
      >
        <BookOpen className="size-1/3" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`Cover of ${title}`}
      width={width}
      height={height}
      unoptimized
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={{ width, height }}
      className={`shrink-0 bg-muted object-cover ${className}`}
    />
  );
}

export default function MyBorrows() {
  const { isPending } = authClient.useSession();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [returningId, setReturningId] = useState("");

  // load the borrowed books of the logged in user
  useEffect(() => {
    if (isPending) return;

    const loadBorrows = async () => {
      try {
        const { data } = await authClient.token();
        if (!data?.token) {
          throw new Error("Please log in again.");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-borrows`, {
          cache: "no-store",
          headers: { authorization: `Bearer ${data.token}` },
        });
        const result = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(result?.message || "Could not load your borrowed books.");
        }

        setBorrows(Array.isArray(result) ? result : (result?.borrows ?? []));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load your borrowed books.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBorrows();
  }, [isPending]);

  // return a book (id = the borrow _id)
  const handleReturn = async (id: string) => {
    if (returningId) return;
    setReturningId(id);

    try {
      const { data } = await authClient.token();
      if (!data?.token) {
        toast.error("Please log in again.", toastOptions);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/return/${id}`, {
        method: "PATCH",
        headers: { authorization: `Bearer ${data.token}` },
      });
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(result?.message || "Could not return the book.");
      }

      setBorrows((prev) => prev.filter((borrow) => borrow._id !== id));
      toast.success("Book returned successfully!", toastOptions);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
        toastOptions,
      );
    } finally {
      setReturningId("");
    }
  };

  if (loading || isPending) return <Loading />;

  return (
    <main className="min-h-[70vh] bg-muted/30 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My Borrows
            </h1>
            <div className="mt-3 h-1 w-14 rounded-full bg-orange-500" />
            <p className="mt-3 text-sm text-muted-foreground">
              Return your books on time so others can enjoy them too.
            </p>
          </div>

          {!errorMessage && borrows.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-600">
              <BookOpen className="size-4" />
              {borrows.length} {borrows.length === 1 ? "book" : "books"} borrowed
            </span>
          )}
        </div>

        {/* ---------- Content ---------- */}
        {errorMessage ? (
          <div className="mt-8 rounded-2xl bg-card p-8 text-center ring-1 ring-border">
            <p className="font-medium text-foreground">Could not load your borrowed books</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : borrows.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl bg-card px-6 py-14 text-center ring-1 ring-border">
            <span className="grid size-14 place-items-center rounded-2xl bg-orange-500/10 text-orange-500">
              <BookOpen className="size-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-bold">No borrowed books</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You have not borrowed any book. Find your next read now.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/books" />}
              className="mt-5 cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
            >
              Browse Books
            </Button>
          </div>
        ) : (
          <>
            {/* ---------- Table (tablet / desktop) ---------- */}
            <div className="mt-8 hidden overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-24 pl-6">Book</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrows.map((item) => (
                    <TableRow key={item._id} className="hover:bg-orange-500/5">
                      <TableCell className="py-4 pl-6">
                        <BookCover
                          src={item.image}
                          title={item.bookTitle}
                          width={56}
                          height={76}
                          className="rounded-md shadow-sm ring-1 ring-border"
                        />
                      </TableCell>
                      <TableCell className="max-w-[260px]">
                        <Link
                          href={`/books/${item.bookId}`}
                          className="line-clamp-2 font-serif text-base font-semibold leading-snug transition-colors hover:text-orange-500"
                        >
                          {item.bookTitle}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(getBorrowDate(item))}
                      </TableCell>
                      <TableCell
                        className={`font-medium ${
                          isOverdue(item.returnDate) ? "text-red-600" : "text-foreground"
                        }`}
                      >
                        {formatDate(item.returnDate)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={item.returnDate} />
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <ReturnButton
                          id={item._id}
                          returningId={returningId}
                          onReturn={handleReturn}
                          size="sm"
                          iconClass="size-3.5"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ---------- Cards (mobile) ---------- */}
            <div className="mt-8 grid gap-4 md:hidden">
              {borrows.map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
                >
                  <div className="flex gap-4">
                    <BookCover
                      src={item.image}
                      title={item.bookTitle}
                      width={80}
                      height={108}
                      className="rounded-lg shadow-sm ring-1 ring-border"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Link
                        href={`/books/${item.bookId}`}
                        className="line-clamp-2 font-serif text-lg font-bold leading-snug transition-colors hover:text-orange-500"
                      >
                        {item.bookTitle}
                      </Link>
                      <StatusBadge value={item.returnDate} />
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4 shrink-0 text-orange-500" />
                        Borrowed: {formatDate(getBorrowDate(item))}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarCheck className="size-4 shrink-0 text-orange-500" />
                        Return by:{" "}
                        <span
                          className={`font-medium ${
                            isOverdue(item.returnDate) ? "text-red-600" : "text-foreground"
                          }`}
                        >
                          {formatDate(item.returnDate)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <ReturnButton
                    id={item._id}
                    returningId={returningId}
                    onReturn={handleReturn}
                    className="mt-4 w-full"
                    iconClass="size-4"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}