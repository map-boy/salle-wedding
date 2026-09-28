import { createHmac, timingSafeEqual } from "crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAllowed, rootEmail } from "./admins";

const COOKIE = "salle_admin";
const DAYS = 7;
const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "salle-wedding";
const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const secret = () => process.env.AUTH_SECRET ?? "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");
const enc = (s: string) => Buffer.from(s, "utf8").toString("base64url");
const dec = (s: string) => Buffer.from(s, "base64url").toString("utf8");

export function passwordOk(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (!pw || !secret()) return false;
  const a = createHmac("sha256", "cmp").update(input).digest();
  const b = createHmac("sha256", "cmp").update(pw).digest();
  return timingSafeEqual(a, b);
}

export async function verifyGoogleIdToken(idToken: string): Promise<{ email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(idToken, JWKS, {
      issuer: `https://securetoken.google.com/${PROJECT}`,
      audience: PROJECT,
    });
    if (!payload.email || payload.email_verified !== true) return null;
    return { email: String(payload.email).toLowerCase(), name: String(payload.name ?? "") };
  } catch {
    return null;
  }
}

export async function startSession(email: string = rootEmail()): Promise<void> {
  const exp = String(Date.now() + DAYS * 86400000);
  const body = `${exp}.${enc(email.toLowerCase())}`;
  const jar = await cookies();
  jar.set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: DAYS * 86400,
  });
}

export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionEmail(): Promise<string | null> {
  if (!secret()) return null;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [exp, e, sig] = parts;
  const good = sign(`${exp}.${e}`);
  if (sig.length !== good.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  if (!(Number(exp) > Date.now())) return null;
  const email = dec(e);
  return (await isAllowed(email)) ? email : null;
}

export async function isAdmin(): Promise<boolean> {
  return (await getSessionEmail()) !== null;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}