import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
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