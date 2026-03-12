import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

export async function POST(req: NextRequest) {
  const { loginId, oldPassword, newPassword } = (await req.json()) as {
    loginId?: string;
    oldPassword?: string;
    newPassword?: string;
  };

  if (!loginId || !oldPassword || !newPassword) {
    return NextResponse.json(
      { message: "필수 정보가 누락되었습니다." },
      { status: 400 },
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { message: "새 비밀번호는 6자 이상이어야 합니다." },
      { status: 400 },
    );
  }

  const rows = await query<{ password: string }>(
    "select password from public.auth_users where login_id = $1",
    [loginId],
  );

  const user = rows[0];

  if (!user || user.password !== oldPassword) {
    return NextResponse.json(
      { message: "현재 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  await query(
    "update public.auth_users set password = $1, must_change_password = false where login_id = $2",
    [newPassword, loginId],
  );

  return NextResponse.json({ status: "ok" });
}

