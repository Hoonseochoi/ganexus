import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { createSession, destroyCurrentSession } from "@/src/lib/engines/session";
import { isColumnNotFound } from "@/src/lib/engines/db";

type AuthUserRow = {
  login_id: string;
  password: string;
  role: "admin" | "manager" | "agent";
  must_change_password: boolean;
};

type ProfileManagerRow = {
  login_id: string;
  is_approved: boolean;
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

    let user: AuthUserRow | undefined;

    // 매니저 코드 로그인: ID와 PW가 동일할 때 profiles.manager_code 로 매니저 조회 후 해당 계정으로 세션 생성
    if (loginId === password && loginId.trim() !== "") {
      try {
        const profileRows = await query<ProfileManagerRow>(
          `select login_id, is_approved from public.profiles
           where manager_code = $1 and role = 'manager'
           limit 1`,
          [loginId.trim()],
        );
        const profile = profileRows[0];
        if (profile) {
          if (!profile.is_approved) {
            return NextResponse.json(
              { message: "아직 승인이 완료되지 않았습니다. 승인 후 다시 시도해주세요." },
              { status: 403 },
            );
          }
          const authRows = await query<AuthUserRow>(
            "select login_id, password, role, must_change_password from public.auth_users where login_id = $1",
            [profile.login_id],
          );
          user = authRows[0];
        }
      } catch (err) {
        if (isColumnNotFound(err)) {
          // manager_code 컬럼이 없으면 무시하고 일반 로그인으로 진행
        } else {
          throw err;
        }
      }
    }

    if (!user) {
      const rows = await query<AuthUserRow>(
        "select login_id, password, role, must_change_password from public.auth_users where login_id = $1",
        [loginId],
      );
      user = rows[0];
      if (!user || user.password !== password) {
        return NextResponse.json(
          { message: "ID 또는 비밀번호가 올바르지 않습니다." },
          { status: 401 },
        );
      }
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

    await createSession(user.login_id);

    // 세션 생성 이후 프로필 정보를 확인해 온보딩 / 승인 여부 판단
    const currentUser = await getCurrentUser();

    // 매니저는 승인된 경우에만 로그인 허용
    if (currentUser?.role === "manager" && !currentUser.profile?.is_approved) {
      return NextResponse.json(
        { message: "아직 승인이 완료되지 않았습니다. 승인 후 다시 시도해주세요." },
        { status: 403 },
      );
    }

    const needsOnboarding =
      currentUser?.role === "admin" &&
      (!currentUser.profile?.full_name || !currentUser.profile?.branch_name);

    const res = NextResponse.json({
      status: "ok",
      loginId: user.login_id,
      role: user.role,
      redirectTo: needsOnboarding ? "/admin/onboarding" : "/",
    });

    return res;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { message: "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}

