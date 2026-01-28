// app/admin/jobs/page.tsx
import { prisma } from "@/lib/prisma";
import AdminJobsClient from "./AdminJobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      published: true,
      titleJp: true,
      titleUa: true,
      titleEn: true,
      companyNameJp: true,
      companyNameUa: true,
      companyNameEn: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  const safeJobs = jobs.map((j) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }));

  return <AdminJobsClient jobs={safeJobs as any} />;
}