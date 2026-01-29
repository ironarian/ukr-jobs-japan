// app/admin/jobs/page.tsx
import { prisma } from "@/lib/prisma";
import AdminJobsClient from "./AdminJobsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Це ТИП, який реально піде в клієнт (без Date і без null у string)
type ClientJobRow = {
  id: string;
  slug: string;
  published: boolean;

  titleJp: string;
  titleUa: string;
  titleEn: string;

  companyNameJp: string;
  companyNameUa: string;
  companyNameEn: string;

  createdAt: string;
  updatedAt: string;
};

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

  // ✅ явно типізуємо j, і прибираємо null -> ""
  const safeJobs: ClientJobRow[] = jobs.map((j: (typeof jobs)[number]) => ({
    id: j.id,
    slug: j.slug ?? "",
    published: Boolean(j.published),

    titleJp: j.titleJp ?? "",
    titleUa: j.titleUa ?? "",
    titleEn: j.titleEn ?? "",

    companyNameJp: j.companyNameJp ?? "",
    companyNameUa: j.companyNameUa ?? "",
    companyNameEn: j.companyNameEn ?? "",

    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }));

  // ✅ без any
  return <AdminJobsClient jobs={safeJobs} />;
}