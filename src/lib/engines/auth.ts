import { query } from "./db";
import { getCurrentSession } from "./session";

type ProfileRow = {
  id: string;
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  is_approved: boolean;
  role: "admin" | "manager" | "agent" | null;
};

type AuthUserRow = {
  login_id: string;
  role: "admin" | "manager" | "agent";
};

export type CurrentUser = {
  loginId: string;
  role: "admin" | "manager" | "agent";
  profile: ProfileRow | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getCurrentSession();
  if (!session) return null;

  const [authRows, profileRows] = await Promise.all([
    query<AuthUserRow>(
      "select login_id, role from public.auth_users where login_id = $1",
      [session.loginId],
    ),
    query<ProfileRow>(
      "select * from public.profiles where login_id = $1",
      [session.loginId],
    ),
  ]);

  const auth = authRows[0];
  if (!auth) return null;

  const profile = profileRows[0] ?? null;

  return {
    loginId: auth.login_id,
    role: auth.role,
    profile,
  };
}

