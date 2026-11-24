"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarCheck, CalendarDays, RotateCcw } from "lucide-react";
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
import Loading from "./loading";

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  borrowDate: string;
  returnDate: string;
};

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

const returnBtn = "gap-1.5 bg-orange-500 text-white hover:bg-orange-600";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function MyBorrowsPage() {
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
          cache: "no-store", // always ask the server, never show an old list
          headers: { authorization: `Bearer ${data.token}` },
        });
        const result = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(result?.message || "Could not load your borrowed books.");
        }

        // the backend may send an array, or { borrows: [...] }
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

      setBorrows((prev) => prev.filter((borrow) => borrow._id !== id)); // remove it from the screen
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

  // while the borrows load, show your loading.tsx screen
  if (loading || isPending) return <Loading />;

  return (
    <main className="bg-muted/30 py-10 sm:py-14">
      <title>BookNook | My Borrows</title>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Borrows
          </h1>
          <div className="mt-3 h-1 w-14 rounded-full bg-orange-500" />
          <p className="mt-3 text-sm text-muted-foreground">
            Books you have borrowed ({borrows.length}). Return them when you are done.
          </p>
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
              className="mt-5 bg-orange-500 text-white hover:bg-orange-600"
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
                    <TableHead className="w-20 pl-6">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead className="pr-6 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrows.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="py-4 pl-6">
                        <Image
                          src={item.bookImage}
                          alt={`Cover of ${item.bookTitle}`}
                          width={56}
                          height={72}
                          unoptimized
                          className="h-[72px] w-14 rounded-md bg-muted object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-serif text-base font-semibold">
                        {item.bookTitle}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.borrowDate)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {formatDate(item.returnDate)}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Button
                          size="sm"
                          onClick={() => handleReturn(item._id)}
                          disabled={returningId === item._id}
                          className={returnBtn}
                        >
                          <RotateCcw className="size-3.5" />
                          {returningId === item._id ? "Returning..." : "Return Book"}
                        </Button>
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
                    <Image
                      src={item.bookImage}
                      alt={`Cover of ${item.bookTitle}`}
                      width={80}
                      height={104}
                      unoptimized
                      className="h-[104px] w-20 shrink-0 rounded-lg bg-muted object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-2">
                      <h2 className="line-clamp-2 font-serif text-lg font-bold leading-snug">
                        {item.bookTitle}
                      </h2>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="size-4 text-orange-500" />
                        Borrowed: {formatDate(item.borrowDate)}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarCheck className="size-4 text-orange-500" />
                        Return by:{" "}
                        <span className="font-medium text-foreground">
                          {formatDate(item.returnDate)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleReturn(item._id)}
                    disabled={returningId === item._id}
                    className={`mt-4 w-full ${returnBtn}`}
                  >
                    <RotateCcw className="size-4" />
                    {returningId === item._id ? "Returning..." : "Return Book"}
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}