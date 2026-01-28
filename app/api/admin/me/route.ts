import { NextRequest, NextResponse } from "next/server";
import { adminCookie, verifyAdminToken } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  const secret = process.env.ADMIN_COOKIE_SECRET ?? "";
  if (!secret) {
    return NextResponse.json({ ok: false }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }

  const token = req.cookies.get(adminCookie.name)?.value;
  const ok = await verifyAdminToken(secret, token);

  return NextResponse.json(
    { ok },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}