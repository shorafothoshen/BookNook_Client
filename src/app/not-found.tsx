import Link from "next/link";
import { BookX, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-muted/30 px-4 py-16">
      <title>BookNook | Page Not Found</title>

      {/* soft glows */}
      <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative text-center">
        {/* big faded 404 behind the content */}
        <p
          aria-hidden="true"
          className="pointer-events-none select-none font-serif text-[9rem] font-bold leading-none text-orange-500/15 sm:text-[12rem] lg:text-[15rem]"
        >
          404
        </p>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
            <BookX className="size-7" />
          </span>

          <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Page not found
          </h1>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-orange-500" />
          <p className="mx-auto mt-4 max-w-md px-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Sorry, we could not find the page you are looking for. It may have
            been moved, or the link may be wrong.
          </p>

          <Button
            nativeButton={false}
            render={<Link href="/" />}
            className="mt-7 h-auto gap-2 rounded-lg border-transparent bg-orange-500 px-7 py-3 text-base font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-orange-600"
          >
            <Home className="size-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}