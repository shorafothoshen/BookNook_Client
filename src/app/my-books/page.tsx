import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = { title: "BookNook | My Books" };

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

// sample data, only for the design
const books = [
  { id: "1", title: "The Silent Garden", author: "Amina Rahman", category: "Fiction", copies: 5, image: "/books/book-1.jpg", description: "A quiet story about a woman who inherits an old garden and the secrets behind its walls." },
  { id: "2", title: "Atoms and Curiosity", author: "Daniel Archer", category: "Science", copies: 3, image: "/books/book-2.jpg", description: "A friendly tour of the tiny particles that build everything around us." },
  { id: "3", title: "Rivers of the Old World", author: "Sofia Marin", category: "History", copies: 2, image: "/books/book-3.jpg", description: "How great rivers shaped the cities, trade and stories of ancient people." },
  { id: "4", title: "The Little Lantern", author: "Tariq Hasan", category: "Kids", copies: 4, image: "/books/book-4.jpg", description: "A small lantern goes on a big night adventure to find its way home." },
];

type Book = (typeof books)[number];

/* ---------- Edit modal (form filled with the old data) ---------- */
function EditDialog({ book }: { book: Book }) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline" size="sm" className="gap-1.5" />}
      >
        <Pencil className="size-3.5" />
        Edit
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Edit book</DialogTitle>
          <DialogDescription>
            Change the details and save your update.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${book.id}`}>Book Title</Label>
              <Input id={`title-${book.id}`} defaultValue={book.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`author-${book.id}`}>Author Name</Label>
              <Input id={`author-${book.id}`} defaultValue={book.author} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`category-${book.id}`}>Category</Label>
              <Select defaultValue={book.category}>
                <SelectTrigger id={`category-${book.id}`} className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`copies-${book.id}`}>Total Copies</Label>
              <Input
                id={`copies-${book.id}`}
                type="number"
                min={1}
                defaultValue={book.copies}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`image-${book.id}`}>Book Image</Label>
            <Input id={`image-${book.id}`} type="file" accept="image/*" />
            <p className="text-xs text-muted-foreground">
              Leave empty to keep the current image.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`desc-${book.id}`}>Short Description</Label>
            <Textarea
              id={`desc-${book.id}`}
              rows={4}
              defaultValue={book.description}
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Delete confirm modal ---------- */
function DeleteDialog({ book }: { book: Book }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-red-500/40 text-red-500 hover:bg-red-500/10 hover:text-red-500"
          />
        }
      >
        <Trash2 className="size-3.5" />
        Delete
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Delete this book?</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{book.title}</span> will
            be removed permanently. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-2">
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="button" className="bg-red-600 text-white hover:bg-red-700">
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MyBooksPage() {
  return (
    <main className="bg-muted/30 py-10 sm:py-14">
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
                <TableRow key={book.id}>
                  <TableCell className="py-4 pl-6">
                    <Image
                      src={book.image}
                      alt={`Cover of ${book.title}`}
                      width={56}
                      height={72}
                      className="h-[72px] w-14 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-serif text-base font-semibold">
                    {book.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{book.author}</TableCell>
                  <TableCell>
                    <Badge className="border-transparent bg-orange-500/10 text-orange-500">
                      {book.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <EditDialog book={book} />
                      <DeleteDialog book={book} />
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
              key={book.id}
              className="flex gap-4 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border"
            >
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
                width={80}
                height={104}
                className="h-26 w-20 shrink-0 rounded-lg object-cover"
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
                  <EditDialog book={book} />
                  <DeleteDialog book={book} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}