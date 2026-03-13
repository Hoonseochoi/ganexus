import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentUser } from "@/src/lib/engines/auth";

/**
 * 관리자 전용: 매니저 신규 등록
 * - auth_users: login_id = 매니저코드, password = 매니저코드, role = 'manager'
 * - profiles: login_id = 매니저코드, role = 'manager', 이름·지점 등
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { message: "관리자 권한이 필요합니다." },
      { status: 403 },
    );
  }

  const { managerCode, fullName, branchName } = (await req.json()) as {
    managerCode?: string;
    fullName?: string;
    branchName?: string;
  };

  const code = (managerCode ?? "").trim();
  const name = (fullName ?? "").trim();
  const branch = (branchName ?? "").trim();

  if (!code) {
    return NextResponse.json(
      { message: "매니저 코드를 입력해주세요." },
      { status: 400 },
    );
  }
  if (!name) {
    return NextResponse.json(
      { message: "이름을 입력해주세요." },
      { status: 400 },
    );
  }
  if (!branch) {
    return NextResponse.json(
      { message: "지점명을 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const existing = await query(
      "select 1 from public.auth_users where login_id = $1",
      [code],
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "이미 사용 중인 매니저 코드입니다." },
        { status: 409 },
      );
    }

    await query(
      `insert into public.auth_users (login_id, password, role, must_change_password)
       values ($1, $2, 'manager', true)`,
      [code, code],
    );

    await query(
      `insert into public.profiles (login_id, full_name, branch_name, role, manager_code, is_approved)
       values ($1, $2, $3, 'manager', $4, true)`,
      [code, name, branch, code],
    );

    return NextResponse.json({
      status: "ok",
      message: "매니저가 등록되었습니다. 해당 매니저코드로 로그인할 수 있습니다.",
    });
  } catch (err) {
    console.error("[admin/managers/register]", err);
    return NextResponse.json(
      { message: "등록 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
