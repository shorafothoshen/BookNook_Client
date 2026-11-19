/**
 * BookNook — My Borrows page (DESIGN ONLY, static sample data)
 *
 * shadcn components: Table, Button
 * Install: npx shadcn@latest add table button
 *
 * Place at: src/app/my-borrows/page.tsx   (private route)
 * Images:   public/books/book-1.jpg ... book-3.jpg (sample covers)
 *
 * The "Borrow This Book" modal (name, email, Confirm Borrow) is already
 * in the Book Details page design.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { CalendarCheck, CalendarDays, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "BookNook | My Borrows" };

// sample data, only for the design
const borrows = [
  { id: "1", title: "The Silent Garden", image: "/books/book-1.jpg", borrowDate: "12 Nov 2026", returnDate: "19 Nov 2026" },
  { id: "2", title: "Atoms and Curiosity", image: "/books/book-2.jpg", borrowDate: "14 Nov 2026", returnDate: "21 Nov 2026" },
  { id: "3", title: "Rivers of the Old World", image: "/books/book-3.jpg", borrowDate: "15 Nov 2026", returnDate: "22 Nov 2026" },
];

const returnBtn =
  "gap-1.5 bg-orange-500 text-white hover:bg-orange-600";

export default function MyBorrowsPage() {
  return (
    <main className="bg-muted/30 py-10 sm:py-14">
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
                <TableRow key={item.id}>
                  <TableCell className="py-4 pl-6">
                    <Image
                      src={item.image}
                      alt={`Cover of ${item.title}`}
                      width={56}
                      height={72}
                      className="h-[72px] w-14 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-serif text-base font-semibold">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.borrowDate}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.returnDate}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button size="sm" className={returnBtn}>
                      <RotateCcw className="size-3.5" />
                      Return Book
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
              key={item.id}
              className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
            >
              <div className="flex gap-4">
                <Image
                  src={item.image}
                  alt={`Cover of ${item.title}`}
                  width={80}
                  height={104}
                  className="h-[104px] w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <h2 className="line-clamp-2 font-serif text-lg font-bold leading-snug">
                    {item.title}
                  </h2>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4 text-orange-500" />
                    Borrowed: {item.borrowDate}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarCheck className="size-4 text-orange-500" />
                    Return by:{" "}
                    <span className="font-medium text-foreground">
                      {item.returnDate}
                    </span>
                  </p>
                </div>
              </div>
              <Button className={`mt-4 w-full ${returnBtn}`}>
                <RotateCcw className="size-4" />
                Return Book
              </Button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}