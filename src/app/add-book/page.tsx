import type { Metadata } from "next";

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

export const metadata: Metadata = { title: "BookNook | Add Book" };

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  return (
    <main className="bg-muted/30 px-4 py-10 sm:py-14">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl font-bold">Add a Book</CardTitle>
          <CardDescription>
            Share a book with other readers on BookNook.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4">
            {/* title + author */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Book Title</Label>
                <Input id="title" name="title" placeholder="Enter book title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author Name</Label>
                <Input id="author" name="author" placeholder="Enter author name" />
              </div>
            </div>

            {/* category + copies */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category">
                  <SelectTrigger id="category" className="w-full">
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
                <Label htmlFor="copies">Total Copies</Label>
                <Input
                  id="copies"
                  name="copies"
                  type="number"
                  min={1}
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            {/* image */}
            <div className="space-y-2">
              <Label htmlFor="image">Book Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
            </div>

            {/* description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Write a short description about the book"
              />
            </div>

            {/* read-only user info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="userName">Your Name</Label>
                <Input
                  id="userName"
                  name="userName"
                  defaultValue="Rahim Uddin"
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Your Email</Label>
                <Input
                  id="userEmail"
                  name="userEmail"
                  defaultValue="rahim@example.com"
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}