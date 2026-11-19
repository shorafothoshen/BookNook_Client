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
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading...</span>

      {/* banner */}
      <div className="flex h-[540px] items-center justify-center bg-[#1b1f2a] px-6 sm:h-[620px] lg:h-[700px]">
        <div className="flex w-full max-w-3xl flex-col items-center gap-5">
          <Skeleton className="h-8 w-56 rounded-full bg-white/10" />
          <Skeleton className="h-11 w-full max-w-xl bg-white/10 sm:h-14" />
          <Skeleton className="h-11 w-4/5 max-w-lg bg-white/10 sm:h-14" />
          <Skeleton className="h-4 w-full max-w-md bg-white/10" />
          <Skeleton className="h-4 w-3/4 max-w-sm bg-white/10" />
          <Skeleton className="mt-3 h-12 w-40 rounded-lg bg-orange-500/30" />
        </div>
      </div>

      {/* new arrivals */}
      <section className="bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
            <Skeleton className="h-10 w-56 sm:h-12 sm:w-72" />
            <Skeleton className="h-1 w-16 rounded-full" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}