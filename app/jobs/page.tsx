// app/jobs/page.tsx
import { prisma } from "@/lib/prisma";
import JobsClient from "./JobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return <JobsClient jobs={jobs as any} />;
}