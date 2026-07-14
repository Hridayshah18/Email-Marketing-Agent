import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const COOKIE_NAME = "dt_admin_session";

export function getAllowedAdminEmails() {
  const values = [
    ...(process.env.ADMIN_EMAILS || "").split(","),
    process.env.ADMIN_EMAIL || "digitalterrene06@gmail.com",
  ];

  return Array.from(
    new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean)),
  );
}

function signAdminEmail(email: string) {
  return crypto
    .createHmac("sha256", process.env.ADMIN_PASSWORD || "")
    .update(email)
    .digest("hex");
}

export function isAllowedAdminEmail(email: string) {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value || !process.env.ADMIN_PASSWORD) return false;

  const [email, signature] = value.split(":");
  if (!email || !signature || !isAllowedAdminEmail(email)) return false;
  const expectedSignature = signAdminEmail(email);
  if (signature.length !== expectedSignature.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/login");
}

export async function isApiAdminAuthenticated() {
  return isAdminAuthenticated();
}

export async function setAdminSession(email: string) {
  const jar = await cookies();
  const normalizedEmail = email.trim().toLowerCase();
  jar.set(COOKIE_NAME, `${normalizedEmail}:${signAdminEmail(normalizedEmail)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
