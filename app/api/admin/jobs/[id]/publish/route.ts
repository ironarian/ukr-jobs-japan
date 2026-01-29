import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const body = await req.json().catch(() => ({}));
  const published = Boolean((body as any)?.published);

  try {
    const updated = await prisma.job.update({
      where: { id },
      data: { published },
      select: { id: true, published: true },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Error";
    const status = msg.toLowerCase().includes("record") ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  return PATCH(req, ctx);
}