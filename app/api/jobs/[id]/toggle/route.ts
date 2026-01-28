// app/api/jobs/[id]/toggle/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

export async function POST(_: Request, { params }: Ctx) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      select: { id: true, published: true },
    });

    if (!job) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: { published: !job.published },
      select: { id: true, published: true },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}