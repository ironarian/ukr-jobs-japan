// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { adminCookie, verifyAdminToken } from "@/lib/adminAuth";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ✅ Allow: login page + login/logout + me
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout") ||
    pathname.startsWith("/api/admin/me")
  ) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const secret = process.env.ADMIN_COOKIE_SECRET ?? "";
  const token = req.cookies.get(adminCookie.name)?.value;

  const ok = secret ? await verifyAdminToken(secret, token) : false;
  if (ok) return NextResponse.next();

  // API -> 401 JSON
  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Page -> redirect to login
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};