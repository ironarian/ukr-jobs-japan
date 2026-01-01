// app/jobs/[id]/page.tsx

import { jobs } from "@/data/jobs";
import JobDetailClient from "./JobDetailClient";

type RouteParams = {
  id: string;
};

// Next 15: params як Promise
export default async function JobDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;

  // 🔹 на всяк випадок прибираємо пробіли / перенос рядка
  const cleanId = id.trim();

  // 🔹 те ж саме з id у вакансіях
  const job = jobs.find((j) => j.id.trim() === cleanId);

  if (!job) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-900/20 bg-white p-8 text-sm text-slate-700 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          Not found
        </h1>
        <p className="mt-2">
          This job doesn’t exist, is not published yet, or was removed.
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Debug ID:&nbsp;
          <code className="rounded bg-slate-100 px-1 py-0.5">{cleanId}</code>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Known IDs:&nbsp;
          <code className="rounded bg-slate-100 px-1 py-0.5">
            {jobs.map((j) => j.id.trim()).join(", ")}
          </code>
        </p>
      </div>
    );
  }

  return <JobDetailClient job={job} />;
}

// допомагає для static generation / посилань
export function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id.trim(),
  }));
}