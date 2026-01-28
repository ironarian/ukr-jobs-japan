// app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import { adminCookie, createAdminToken } from "@/lib/adminAuth";

// ✅ best-effort rate limit (memory). На serverless може "обнулятись" між інстансами — але краще ніж нічого.
type Bucket = { count: number; resetAt: number };
const g = globalThis as unknown as { __adminLoginRL?: Map<string, Bucket>; __adminLoginRLTicks?: number };
const buckets = (g.__adminLoginRL ??= new Map<string, Bucket>());
g.__adminLoginRLTicks ??= 0;

const WINDOW_MS = 5 * 60 * 1000; // 5 хв
const MAX_FAILS = 10;

function getClientIp(req: Request) {
  // Cloudflare
  const cf = req.headers.get("cf-connecting-ip");
  if (cf && cf.trim()) return cf.trim();

  // Standard proxy header
  const xf = req.headers.get("x-forwarded-for");
  if (xf && xf.trim()) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }

  const xr = req.headers.get("x-real-ip");
  if (xr && xr.trim()) return xr.trim();

  // fallback
  return "unknown";
}

function sanitizeNext(nextRaw: string | null) {
  const next = (nextRaw || "/admin").trim();

  // тільки внутрішні шляхи
  if (!next.startsWith("/")) return "/admin";
  if (next.startsWith("//")) return "/admin";
  if (next.includes("://")) return "/admin";
  if (next.includes("\n") || next.includes("\r")) return "/admin";

  return next;
}

function redirectBack(origin: string, next: string, error: string) {
  const back = new URL("/admin/login", origin);
  back.searchParams.set("next", next);
  back.searchParams.set("error", error);
  return NextResponse.redirect(back, { status: 303 });
}

function cleanupOldBuckets(now: number) {
  // best-effort cleanup щоб Map не ріс вічно
  // чистимо раз на ~50 запитів
  g.__adminLoginRLTicks = (g.__adminLoginRLTicks ?? 0) + 1;
  if ((g.__adminLoginRLTicks ?? 0) % 50 !== 0) return;

  for (const [k, b] of buckets.entries()) {
    if (now >= b.resetAt) buckets.delete(k);
  }
}

export async function POST(req: Request) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.ADMIN_COOKIE_SECRET ?? "";

  const url = new URL(req.url);
  const next = sanitizeNext(url.searchParams.get("next"));

  if (!ADMIN_PASSWORD || !secret) {
    return redirectBack(url.origin, next, "1");
  }

  const ip = getClientIp(req);
  const now = Date.now();
  cleanupOldBuckets(now);

  // ensure bucket
  const existing = buckets.get(ip);
  const bucket =
    !existing || now >= existing.resetAt
      ? { count: 0, resetAt: now + WINDOW_MS }
      : existing;

  // password from JSON or FormData
  let password = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      password = String((body as any)?.password ?? "");
    } else {
      const form = await req.formData();
      password = String(form.get("password") ?? "");
    }
  } catch {
    password = "";
  }

  // if already rate-limited
  if (bucket.count >= MAX_FAILS && now < bucket.resetAt) {
    buckets.set(ip, bucket);
    return redirectBack(url.origin, next, "rate");
  }

  // wrong password -> increment + maybe rate
  if (password !== ADMIN_PASSWORD) {
    bucket.count += 1;
    buckets.set(ip, bucket);

    // ✅ якщо щойно дійшли до ліміту — одразу показуємо rate
    if (bucket.count >= MAX_FAILS) {
      return redirectBack(url.origin, next, "rate");
    }

    return redirectBack(url.origin, next, "1");
  }

  // success -> reset bucket
  buckets.delete(ip);

  const token = await createAdminToken(secret);

  const res = NextResponse.redirect(new URL(next, url.origin), { status: 303 });

  res.cookies.set({
    name: adminCookie.name,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminCookie.maxAge,
  });

  res.headers.set("Cache-Control", "no-store");
  return res;
}