// app/lib/adminAuth.ts
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const ONE_WEEK_SEC = 60 * 60 * 24 * 7;

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function signHmac(data: string, secret: string) {
  return base64url(crypto.createHmac("sha256", secret).update(data).digest());
}

function safeJsonParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

type SessionPayload = {
  v: number;
  iat: number;
  exp: number;
};

export function makeAdminSessionToken(secret: string) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { v: 1, iat: now, exp: now + ONE_WEEK_SEC };

  const payloadB64 = base64url(JSON.stringify(payload));
  const sig = signHmac(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifyAdminSessionToken(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadB64, sig] = parts;
  const expected = signHmac(payloadB64, secret);
  if (sig !== expected) return false;

  const payloadJson = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  const payload = safeJsonParse<SessionPayload>(payloadJson);
  if (!payload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

export async function setAdminCookie() {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) throw new Error("ADMIN_COOKIE_SECRET is missing");

  const token = makeAdminSessionToken(secret);
  const store = await cookies();

  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK_SEC,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminAuthed() {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) return false;

  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  return verifyAdminSessionToken(token, secret);
}