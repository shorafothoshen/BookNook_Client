"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Bounce, toast, type ToastOptions } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

/* upload the image file to imgbb and get back the image URL */
async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body },
  );
  const result = await res.json().catch(() => null);

  if (!result?.success) {
    throw new Error("Image upload failed. Please try again.");
  }
  return result.data.display_url as string;
}

export default function AddBookPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending || loading) return;
    if (!user) {
      toast.error("Please log in before adding a book.", toastOptions);
      router.push("/login");
      return;
    }

    const form = event.currentTarget;

    // 1. take the data out of the input fields (same as the Login page)
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;
    const imageFile = formData.get("image");

    const title = (data.title ?? "").trim();
    const author = (data.author ?? "").trim();
    const description = (data.description ?? "").trim();
    const totalCopies = Number(data.copies);

    if (
      !title ||
      !author ||
      !category ||
      !description ||
      !Number.isInteger(totalCopies) ||
      totalCopies < 1
    ) {
      toast.error("Please complete all book details correctly.", toastOptions);
      return;
    }

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      toast.error("Please choose a book image.", toastOptions);
      return;
    }
    if (!imageFile.type.startsWith("image/")) {
      toast.error("Please choose an image file.", toastOptions);
      return;
    }

    setLoading(true);
    try {
      const { data: jwtData } = await authClient.token();
      if (!jwtData?.token) {
        toast.error("Please log in again.", toastOptions);
        return;
      }

      const image = await uploadImage(imageFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/add-books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtData.token}`,
          },
          body: JSON.stringify({
            title,
            author,
            category,
            image,
            description,
            totalCopies,
          }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.message || "Could not add the book.");
      }

      toast.success("Book added successfully!", toastOptions);
      form.reset();
      setCategory("");
      router.push("/my-books");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        toastOptions,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-muted/30 px-4 py-10 sm:py-14">
      <title>BookNook | Add Book</title>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl font-bold">
            Add a Book
          </CardTitle>
          <CardDescription>
            Share a book with other readers on BookNook.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input
                  id="author"
                  name="author"
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={category}
                  onValueChange={(value) => setCategory(value ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full"
                    aria-required="true"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="copies">Total Copies</Label>
                <Input
                  id="copies"
                  name="copies"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="e.g. 3"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Book Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Write a short description about the book"
                required
              />
            </div>

            {/* read-only, shown from the logged in user (not sent from here) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  value={user?.name ?? ""}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Your Email</Label>
                <Input
                  id="userEmail"
                  value={user?.email ?? ""}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || isPending}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading ? "Adding Book..." : "Add Book"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
