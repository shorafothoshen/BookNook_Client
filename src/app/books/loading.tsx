import { Skeleton } from "@/components/ui/skeleton";

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-4 p-5 sm:p-6">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="bg-muted/30 py-12 sm:py-16" role="status" aria-busy="true">
      <span className="sr-only">Loading...</span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <Skeleton className="h-10 w-48 sm:h-12 sm:w-60" />
          <Skeleton className="h-1 w-16 rounded-full" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}