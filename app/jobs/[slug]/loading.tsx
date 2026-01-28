// app/jobs/[slug]/loading.tsx
export default function LoadingJobDetail() {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        {/* back button skeleton */}
        <div className="h-9 w-44 animate-pulse rounded-full bg-slate-100" />

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* top header skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="w-full space-y-3">
              <div className="h-8 w-[70%] animate-pulse rounded-2xl bg-slate-100" />
              <div className="h-4 w-[52%] animate-pulse rounded-2xl bg-slate-100" />

              <div className="mt-3 flex flex-wrap gap-2">
                <div className="h-7 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="h-7 w-48 animate-pulse rounded-full bg-slate-100" />
                <div className="h-7 w-36 animate-pulse rounded-full bg-slate-100" />
                <div className="h-7 w-40 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>

            <div className="h-10 w-44 animate-pulse rounded-full bg-slate-100" />
          </div>

          {/* body skeleton */}
          <div className="mt-8 space-y-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 animate-pulse rounded-2xl bg-slate-100 ${
                  i % 3 === 2 ? "w-[65%]" : "w-[92%]"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-3">
            <div className="h-3 w-40 animate-pulse rounded-full bg-slate-100" />
          </div>
        </article>
      </div>
    </main>
  );
}