"use client";
import { useState } from "react";
import { CalendarDays, Copy } from "lucide-react";
import { Bounce, toast } from "react-toastify";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { getToken } from "@/lib/token";
import { type borrowedBook } from "@/lib/types";

const toastOptions = {
  position: "top-center" as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Bounce,
};

async function borrowBook(bookId: string, returnDate: string) {
  try {
    const token = await getToken();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/borrow/${bookId}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ returnDate }),
    });
    const result = await res.json().catch(() => null);

    if (!res.ok) {
      return { success: false, message: result?.message || "Could not borrow this book." };
    }

    return { success: true, message: result?.message || "Book borrowed successfully" };
  } catch (error) {
    console.error("Borrow failed:", error);
    return { success: false, message: "Something went wrong. Try again." };
  }
}

export default function BorrowDialog({
  bookId,
  title,
  initialAvailable,
  totalCopies,
  addedBy,
  addedOn,
  userName,
  userEmail,
}: borrowedBook) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableCopies, setAvailableCopies] = useState(initialAvailable);

  const available = availableCopies > 0;

  async function handleBorrow() {
    setLoading(true);

    const returnDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const result = await borrowBook(bookId, returnDate);

    setLoading(false);

    if (result.success) {
      toast.success(result.message, toastOptions);
      setOpen(false);
      setAvailableCopies((prev) => Math.max(prev - 1, 0)); // sathe sathe 1 kome jabe
    } else {
      toast.error(result.message, toastOptions);
    }
  }

  return (
    <>
      {/* ---------- Details ---------- */}
      <div className="mt-6 grid gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-orange-500 font-semibold text-white">
              {addedBy.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Added by</p>
            <p className="truncate text-sm font-semibold text-foreground">{addedBy}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-orange-500" />
            Added on <span className="font-medium text-foreground">{addedOn}</span>
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

      {/* ---------- Borrow ---------- */}
      <div className="mt-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            disabled={!available}
            render={
              <Button className="h-auto w-full cursor-pointer rounded-xl border-transparent bg-orange-500 py-3 text-base font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600 disabled:opacity-60 sm:w-auto sm:px-10" />
            }
          >
            {available ? "Borrow This Book" : "Not Available"}
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Borrow this book</DialogTitle>
              <DialogDescription>
                You are borrowing{" "}
                <span className="font-medium text-foreground">{title}</span> for 7 days.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="borrowName">Your Name</Label>
                <Input
                  id="borrowName"
                  defaultValue={userName}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="borrowEmail">Your Email</Label>
                <Input
                  id="borrowEmail"
                  defaultValue={userEmail}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <DialogClose
                  render={<Button type="button" variant="outline" disabled={loading} />}
                >
                  Cancel
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleBorrow}
                  disabled={loading}
                  className="cursor-pointer bg-orange-500 text-white hover:bg-orange-600"
                >
                  {loading ? "Borrowing..." : "Confirm Borrow"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}