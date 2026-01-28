// lib/adminAuth.ts
const COOKIE_NAME = "admin_auth";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 днів
const NONCE_BYTES = 16;

function enc(s: string) {
  return new TextEncoder().encode(s);
}

function toHex(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(bytes: number) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr);
}

async function hmacSHA256(secret: string, data: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc(data));
  return toHex(sig);
}

// token format: v1.<ts>.<nonce>.<sig>
export async function createAdminToken(secret: string) {
  const ts = Date.now().toString();
  const nonce = randomHex(NONCE_BYTES);
  const base = `v1.${ts}.${nonce}`;
  const sig = await hmacSHA256(secret, base);
  return `${base}.${sig}`;
}

export async function verifyAdminToken(secret: string, token: string | undefined | null) {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [v, ts, nonce, sig] = parts;
  if (v !== "v1") return false;
  if (!ts || !nonce || !sig) return false;

  const base = `v1.${ts}.${nonce}`;
  const expected = await hmacSHA256(secret, base);
  if (expected !== sig) return false;

  // expiry: 30 days
  const ageMs = Date.now() - Number(ts);
  if (!Number.isFinite(ageMs) || ageMs < 0) return false;
  if (ageMs > MAX_AGE_SECONDS * 1000) return false;

  return true;
}

export const adminCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
};