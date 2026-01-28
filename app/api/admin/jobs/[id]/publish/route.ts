// app/api/admin/jobs/[id]/publish/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function PATCH(req: Request, { params }: Ctx) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const published = Boolean(body?.published);

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: { published },
      select: { id: true, published: true },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    // prisma throws if not found
    const msg = typeof e?.message === "string" ? e.message : "Error";
    const status = msg.toLowerCase().includes("record") ? 404 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}

// (опціонально) якщо десь ще викликаєш POST — залиш як alias:
export async function POST(req: Request, ctx: Ctx) {
  return PATCH(req, ctx);
}