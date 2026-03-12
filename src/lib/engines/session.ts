import { cookies } from "next/headers";
import { query } from "./db";
import { randomUUID } from "crypto";

const SESSION_COOKIE_NAME = "ga_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일

type SessionRow = {
  id: string;
  user_login_id: string;
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
};

export async function createSession(loginId: string): Promise<string> {
  const sessionId = randomUUID();
  const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await query(
    "insert into public.sessions (id, user_login_id, expires_at) values ($1, $2, $3)",
    [sessionId, loginId, expires.toISOString()],
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return sessionId;
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const current = cookieStore.get(SESSION_COOKIE_NAME);
  if (!current?.value) return;

  await query(
    "update public.sessions set revoked_at = timezone('utc', now()) where id = $1",
    [current.value],
  );

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentSession():
  Promise<{ loginId: string } | null> {
  const cookieStore = await cookies();
  const current = cookieStore.get(SESSION_COOKIE_NAME);
  if (!current?.value) return null;

  const rows = await query<SessionRow>(
    "select id, user_login_id, expires_at, revoked_at from public.sessions where id = $1",
    [current.value],
  );

  const session = rows[0];
  if (!session) return null;

  const now = Date.now();
  const isExpired =
    session.expires_at !== null && new Date(session.expires_at).getTime() < now;
  const isRevoked =
    session.revoked_at !== null && new Date(session.revoked_at).getTime() <= now;

  if (isExpired || isRevoked) {
    return null;
  }

  return { loginId: session.user_login_id };
}

