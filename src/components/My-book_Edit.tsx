import { useState, type FormEvent } from "react";
import {  Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { toast, type ToastOptions, Bounce } from "react-toastify";
import { BookType } from "@/lib/types";
import {getToken} from "@/lib/token";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

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

async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY_SECRECT_KEY}`,
    { method: "POST", body },
  );
  const result = await res.json().catch(() => null);

  if (!result?.success) {
    throw new Error("Image upload failed. Please try again.");
  }
  return result.data.display_url as string;
}

export default function EditDialog({
  book,
  onSaved,
}: {
  book: BookType;
  onSaved: (id: string, changes: Partial<BookType>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(book.category);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;
    const imageFile = formData.get("image");

    const title = (data.title ?? "").trim();
    const author = (data.author ?? "").trim();
    const description = (data.description ?? "").trim();

    if (!title || !author || !category || !description) {
      toast.error("Please complete all book details.", toastOptions);
      return;
    }

    const newImage =
      imageFile instanceof File && imageFile.size > 0 ? imageFile : null;
    if (newImage && !newImage.type.startsWith("image/")) {
      toast.error("Please choose an image file.", toastOptions);
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();

      const changes: Partial<BookType> = { title, author, category, description };
      // upload only if a new image was chosen, otherwise the old image stays
      if (newImage) changes.image = await uploadImage(newImage);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-book/${book._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(changes),
      });

      onSaved(book._id, changes);
      toast.success("Book updated successfully!", toastOptions);
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not update the book.",
        toastOptions,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${book._id}`}>Book Title</Label>
              <Input
                id={`title-${book._id}`}
                name="title"
                defaultValue={book.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`author-${book._id}`}>Author Name</Label>
              <Input
                id={`author-${book._id}`}
                name="author"
                defaultValue={book.author}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`category-${book._id}`}>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "")}
            >
              <SelectTrigger id={`category-${book._id}`} className="w-full">
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
            <Label htmlFor={`image-${book._id}`}>Book Image</Label>
            <Input
              id={`image-${book._id}`}
              name="image"
              type="file"
              accept="image/*"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to keep the current image.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`desc-${book._id}`}>Short Description</Label>
            <Textarea
              id={`desc-${book._id}`}
              name="description"
              rows={4}
              defaultValue={book.description}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={saving}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}