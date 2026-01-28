// app/api/admin/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCookie, verifyAdminToken } from "@/lib/adminAuth";

async function requireAdmin(req: NextRequest) {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) return { ok: false as const, res: NextResponse.json({ error: "ADMIN_COOKIE_SECRET missing" }, { status: 500 }) };

  const token = req.cookies.get(adminCookie.name)?.value;
  const authed = await verifyAdminToken(secret, token);
  if (!authed) return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  return { ok: true as const, res: null };
}

// GET /api/admin/jobs — список всіх вакансій для адмінки
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.res;

  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(jobs, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch admin jobs" }, { status: 500 });
  }
}