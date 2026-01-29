import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/app/lib/adminAuth";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const ok = await isAdminAuthed();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.job.update({
    where: { id },
    data: { published: !job.published },
    select: { id: true, published: true },
  });

  return NextResponse.json({ ok: true, job: updated });
}