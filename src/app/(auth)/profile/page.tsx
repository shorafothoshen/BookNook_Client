"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Bounce, toast, type ToastOptions } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// same toast style as the Login and Register pages
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

type Errors = { name?: string; photo?: string };

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const photo = String(fd.get("photo") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (photo && !isValidUrl(photo)) {
      next.photo = "Please enter a valid photo URL (starting with http:// or https://).";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(Object.values(next)[0], toastOptions);
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.updateUser({
        name,
        image: photo || null, // empty field removes the photo
      });

      if (error) {
        toast.error("Could not update your profile. Please try again.", toastOptions);
        return;
      }

      toast.success("Profile updated successfully!", toastOptions);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("You have been logged out.", toastOptions);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again.", toastOptions);
    }
  };

  /* ---------- loading skeleton ---------- */
  if (isPending) {
    return (
      <main className="bg-muted/30 px-4 py-10 sm:py-14">
        <div className="mx-auto w-full max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-44 rounded bg-muted" />
          <div className="h-32 rounded-2xl bg-muted" />
          <div className="h-72 rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="bg-muted/30 px-4 py-20 text-center">
        <p className="text-muted-foreground">
          We could not find your profile.{" "}
          <Link href="/login" className="font-medium text-orange-500 hover:underline">
            Please log in
          </Link>
          .
        </p>
      </main>
    );
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-muted/30 px-4 py-10 sm:py-14">
      <title>My Profile</title>
      <div className="mx-auto w-full max-w-2xl">
        {/* ---------- heading ---------- */}
        <div className="text-center sm:text-left">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            My Profile
          </h1>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-orange-500 sm:mx-0" />
          <p className="mt-3 text-sm text-muted-foreground">
            See and update your BookNook account details.
          </p>
        </div>

        {/* ---------- account summary ---------- */}
        <Card className="mt-6">
          <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <Avatar className="size-20 shrink-0 ring-2 ring-orange-500 ring-offset-2 ring-offset-card">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-orange-500 text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate font-serif text-xl font-bold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              className="w-full gap-2 border-red-500/40 text-red-500 hover:bg-red-500/10 hover:text-red-500 sm:w-auto"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* ---------- edit form ---------- */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="font-serif text-xl font-bold">Edit Profile</CardTitle>
            <CardDescription>Change your name or photo.</CardDescription>
          </CardHeader>

          <CardContent>
            <form key={user.id} onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user.name}
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="bg-muted text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  name="photo"
                  type="url"
                  defaultValue={user.image ?? ""}
                  placeholder="https://example.com/photo.jpg"
                  aria-invalid={!!errors.photo}
                />
                {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}