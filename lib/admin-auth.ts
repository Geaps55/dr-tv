import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";

const COOKIE_NAME = "dr_tv_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET is missing or too short (need 16+ chars).");
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function issueSession(): string {
  const nonce = randomBytes(12).toString("base64url");
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${nonce}.${expires}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [nonce, expiresStr, sig] = parts;
  const expected = sign(`${nonce}.${expiresStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;
  return true;
}

export function isAdminAuthenticated(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export function requireAdmin(): void {
  if (!isAdminAuthenticated()) redirect("/admin/login");
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}
