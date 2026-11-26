"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getToken } from "@/lib/token";
import { BookType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditDialog from "@/components/My-book_Edit";
import DeleteDialog from "@/components/my-book_delete";
import Loading from "@/app/my-books/loading";

export default function MyBooksPage() {
  const { isPending } = authClient.useSession();
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // runs every time this page opens, so a newly added book shows up without a manual reload
  useEffect(() => {
    if (isPending) return;

    const loadBooks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-books`, {
          cache: "no-store", // always ask the server, never show an old list
          headers: { authorization: `Bearer ${await getToken()}` },
        });
        const result = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(result?.message || "Could not load your books.");
        }

        // the backend may send an array, or { books: [...] }
        setBooks(Array.isArray(result) ? result : (result?.books ?? []));
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not load your books.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [isPending]);

  const handleSaved = (id: string, changes: Partial<BookType>) => {
    setBooks((prev) => prev.map((b) => (b._id === id ? { ...b, ...changes } : b)));
  };

  const handleDeleted = (id: string) => {
    setBooks((prev) => prev.filter((b) => b._id !== id));
  };

  // while the books load, show your loading.tsx screen
  if (loading || isPending) return <Loading />;

  return (
    <main className="bg-muted/30 py-10 sm:py-14">
      <title>BookNook | My Books</title>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Heading ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              My Books
            </h1>
            <div className="mt-3 h-1 w-14 rounded-full bg-orange-500" />
            <p className="mt-3 text-sm text-muted-foreground">
              Books you added to BookNook ({books.length}).
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/add-book" />}
            className="w-full gap-2 bg-orange-500 text-white hover:bg-orange-600 sm:w-auto"
          >
            <Plus className="size-4" />
            Add Book
          </Button>
        </div>

        {/* ---------- Content ---------- */}
        {errorMessage ? (
          <div className="mt-8 rounded-2xl bg-card p-8 text-center ring-1 ring-border">
            <p className="font-medium text-foreground">Could not load your books</p>
            <p className="mt-1 text-sm text-muted-foreground">{errorMessage}</p>
          </div>
        ) : books.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl bg-card px-6 py-14 text-center ring-1 ring-border">
            <span className="grid size-14 place-items-center rounded-2xl bg-orange-500/10 text-orange-500">
              <BookOpen className="size-7" />
            </span>
            <h2 className="mt-4 font-serif text-xl font-bold">No books yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You have not added any book. Add your first one now.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/add-book" />}
              className="mt-5 bg-orange-500 text-white hover:bg-orange-600"
            >
              Add Book
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
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="pr-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell className="py-4 pl-6">
                        <Image
                          src={book.image}
                          alt={`Cover of ${book.title}`}
                          width={56}
                          height={72}
                          unoptimized
                          className="h-[72px] w-14 rounded-md bg-muted object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-serif text-base font-semibold">
                        {book.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {book.author}
                      </TableCell>
                      <TableCell>
                        <Badge className="border-transparent bg-orange-500/10 text-orange-500">
                          {book.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-2">
                          <EditDialog book={book} onSaved={handleSaved} />
                          <DeleteDialog book={book} onDeleted={handleDeleted} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ---------- Cards (mobile) ---------- */}
            <div className="mt-8 grid gap-4 md:hidden">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
                >
                  <Image
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    width={80}
                    height={104}
                    unoptimized
                    className="h-[104px] w-20 shrink-0 rounded-lg bg-muted object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Badge className="w-fit border-transparent bg-orange-500/10 text-orange-500">
                      {book.category}
                    </Badge>
                    <h2 className="mt-2 line-clamp-1 font-serif text-lg font-bold">
                      {book.title}
                    </h2>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      by {book.author}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <EditDialog book={book} onSaved={handleSaved} />
                      <DeleteDialog book={book} onDeleted={handleDeleted} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}