import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-muted/30 py-10 sm:py-14" role="status" aria-busy="true">
      <span className="sr-only">Loading...</span>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-40" />

        <div className="mt-6 grid gap-8 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-6 md:grid-cols-2 lg:gap-12 lg:p-8">
          {/* image */}
          <Skeleton className="aspect-[4/3] w-full rounded-xl md:aspect-auto md:min-h-[420px]" />

          {/* info */}
          <div className="flex flex-col">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="mt-4 h-10 w-4/5" />
            <Skeleton className="mt-3 h-5 w-40" />
            <Skeleton className="my-6 h-px w-full" />

            <Skeleton className="h-4 w-28" />
            <div className="mt-3 space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-6 grid gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>

            <Skeleton className="mt-8 h-12 w-full rounded-xl sm:w-52" />
          </div>
        </div>
      </div>
    </main>
  );
}