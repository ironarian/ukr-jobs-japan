import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const job = await prisma.job.findUnique({
    where: { slug },
    select: {
      published: true,
      titleUa: true,
      titleJp: true,
      titleEn: true,
      companyNameUa: true,
      companyNameJp: true,
      companyNameEn: true,
      locationUa: true,
      locationJp: true,
      locationEn: true,
      salaryFrom: true,
      salaryTo: true,
      salaryCurrency: true,
    },
  });

  // не світимо неопубліковані
  if (!job || !job.published) {
    return NextResponse.json({ ok: true, job: null });
  }

  return NextResponse.json({ ok: true, job });
}