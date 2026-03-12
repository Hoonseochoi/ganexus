import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { createSession, destroyCurrentSession } from "@/src/lib/engines/session";

type AuthUserRow = {
  login_id: string;
  password: string;
  role: "admin" | "manager" | "agent";
  must_change_password: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const { loginId, password } = (await req.json()) as {
      loginId?: string;
      password?: string;
    };

    if (!loginId || !password) {
      return NextResponse.json(
        { message: "ID와 비밀번호를 모두 입력해주세요." },
        { status: 400 },
      );
    }

    const rows = await query<AuthUserRow>(
      "select login_id, password, role, must_change_password from public.auth_users where login_id = $1",
      [loginId],
    );

    const user = rows[0];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "ID 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    // 기존 세션은 정리하고 새 세션 발급
    await destroyCurrentSession();

    if (user.must_change_password) {
      const res = NextResponse.json({
        status: "must_change_password",
        loginId: user.login_id,
      });
      await createSession(user.login_id);
      return res;
    }

    const res = NextResponse.json({
      status: "ok",
      loginId: user.login_id,
      role: user.role,
    });

    await createSession(user.login_id);
    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { message: "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}

