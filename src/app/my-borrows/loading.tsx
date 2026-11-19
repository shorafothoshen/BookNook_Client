import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="bg-muted/30 py-10 sm:py-14" role="status" aria-busy="true">
      <span className="sr-only">Loading...</span>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* heading */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-1 w-14 rounded-full" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>

        {/* table (tablet / desktop) */}
        <div className="mt-8 hidden overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border md:block">
          <div className="grid grid-cols-[80px_1.6fr_1fr_1fr_1.2fr] items-center gap-4 bg-muted/50 px-6 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[80px_1.6fr_1fr_1fr_1.2fr] items-center gap-4 border-t border-border px-6 py-4"
            >
              <Skeleton className="h-[72px] w-14 rounded-md" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-end">
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          ))}
        </div>

        {/* cards (mobile) */}
        <div className="mt-8 grid gap-4 md:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
              <div className="flex gap-4">
                <Skeleton className="h-[104px] w-20 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="mt-4 h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}