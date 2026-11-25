import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast, type ToastOptions, Bounce } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { BookType } from "@/lib/types";
import {getToken} from "@/lib/token";

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

/* ---------- Delete confirm modal ---------- */
export default function DeleteDialog({
  book,
  onDeleted,
}: {
  book: BookType;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.BACK_END_SERVER_API_URL}/api/delete-book/${book._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      onDeleted(book._id); // remove it from the screen
      toast.success("Book deleted successfully!", toastOptions);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not delete the book.",
        toastOptions,
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Yes, Delete"}
          </Button>
       </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}