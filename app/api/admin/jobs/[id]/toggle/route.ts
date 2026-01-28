// app/api/admin/jobs/[id]/toggle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/app/lib/adminAuth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const ok = await isAdminAuthed();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.job.update({
    where: { id: params.id },
    data: { published: !job.published },
    select: { id: true, published: true },
  });

  return NextResponse.json({ ok: true, job: updated });
}