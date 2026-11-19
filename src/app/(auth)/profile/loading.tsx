import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function Loading() {
  return (
    <main className="bg-muted/30 px-4 py-10 sm:py-14" role="status" aria-busy="true">
      <span className="sr-only">Loading...</span>

      <div className="mx-auto w-full max-w-2xl">
        {/* heading */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-44" />
          <Skeleton className="h-1 w-14 rounded-full" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>

        {/* account summary */}
        <div className="mt-6 flex flex-col gap-5 rounded-xl bg-card p-6 ring-1 ring-border sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 shrink-0 rounded-full" />
            <div className="space-y-2.5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-full sm:w-28" />
        </div>

        {/* edit form */}
        <div className="mt-4 space-y-4 rounded-xl bg-card p-6 ring-1 ring-border">
          <Skeleton className="h-6 w-36" />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <Skeleton className="h-10 w-full bg-orange-500/30" />
        </div>
      </div>
    </main>
  );
}