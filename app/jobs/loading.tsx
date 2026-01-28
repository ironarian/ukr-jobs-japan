// app/jobs/loading.tsx
export default function LoadingJobs() {
  return (
    <main className="mx-auto mb-24 mt-10 max-w-6xl px-4 lg:px-0">
      <section className="mx-auto max-w-5xl rounded-[30px] border border-slate-200 bg-white px-8 py-8 shadow-[0_14px_50px_rgba(15,23,42,0.10)]">
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
          <div className="h-7 w-[70%] animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-4 w-[55%] animate-pulse rounded-2xl bg-slate-100" />
        </div>

        {/* Filter box skeleton */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
              <div className="h-4 w-72 animate-pulse rounded-2xl bg-slate-100" />
            </div>
            <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-40 animate-pulse rounded-full bg-slate-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>

          <div className="mt-4 h-4 w-40 animate-pulse rounded-2xl bg-slate-100" />
        </div>

        {/* Cards skeleton */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.10)]"
            >
              <div className="space-y-3">
                <div className="h-5 w-[75%] animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-4 w-[55%] animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-4 w-[60%] animate-pulse rounded-2xl bg-slate-100" />

                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                </div>

                <div className="mt-3 space-y-2">
                  <div className="h-4 w-[92%] animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-4 w-[82%] animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-4 w-[60%] animate-pulse rounded-2xl bg-slate-100" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="h-3 w-28 animate-pulse rounded-full bg-slate-100" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-8 w-28 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}