"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";

type Field = "name" | "email" | "photo" | "password" | "confirmPassword";
type Errors = Partial<Record<Field, string>>;

/* ---------- password rules from the requirement doc ---------- */
function getPasswordError(password: string): string {
  if (!/[A-Z]/.test(password)) {
    return "Password must have at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must have at least one lowercase letter.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }
  return "";
}

/* ---------- upload the chosen image file to imgbb, get back a URL ---------- */
async function uploadPhoto(file: File): Promise<string> {
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
    { method: "POST", body }
  );
  const data = await res.json();

  if (!data?.success) throw new Error("Photo upload failed. Please try again.");
  return data.data.display_url as string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const confirmPassword = String(fd.get("confirmPassword") ?? "");
    const photo = fd.get("photo");
    const photoFile = photo instanceof File && photo.size > 0 ? photo : null;

    /* ---------- validate ---------- */
    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email.";
    if (photoFile && !photoFile.type.startsWith("image/")) {
      next.photo = "Please choose an image file.";
    }
    const passwordError = getPasswordError(password);
    if (passwordError) next.password = passwordError;
    else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(Object.values(next)[0]); // stop here: invalid, so no register
      return;
    }

    /* ---------- register ---------- */
    setLoading(true);
    try {
      const image = photoFile ? await uploadPhoto(photoFile) : undefined;

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (error) {
        toast.error(error.message ?? "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      toast.error("Google sign-in failed. Please try again.");
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-10">
      {/* page title (React 19 moves this into <head>) */}
      <title>BookNook | Register</title>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-3xl font-bold">Register</CardTitle>
          <CardDescription>Create your BookNook account.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                aria-invalid={!!errors.photo}
              />
              {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                aria-invalid={!!errors.password}
              />
              {errors.password ? (
                <p className="text-sm text-destructive">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Use an uppercase letter, a lowercase letter and at least 6 characters.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white hover:bg-orange-600"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="w-full gap-2"
          >
            <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.9-2.1 5.3-4.5 6.9l7.3 5.7c4.3-4 6.9-9.9 6.9-16.6z" />
              <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.3.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-orange-500 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}