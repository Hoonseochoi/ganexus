import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

type ManagerProfileRow = {
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  role: "admin" | "manager" | "agent" | null;
  is_approved: boolean;
  manager_code: string | null;
};

function normalizeName(value: string): string {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const { managerCode, fullName, branchName, newPassword } = (await req.json()) as {
    managerCode?: string;
    fullName?: string;
    branchName?: string;
    newPassword?: string;
  };

  const code = (managerCode ?? "").trim();
  const name = (fullName ?? "").trim();
  const branch = (branchName ?? "").trim();

  if (!code || !name || !branch || !newPassword) {
    return NextResponse.json(
      { message: "매니저 코드, 이름, 지점명, 새 비밀번호를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { message: "새 비밀번호는 6자 이상이어야 합니다." },
      { status: 400 },
    );
  }

  const profileRows = await query<ManagerProfileRow>(
    `
      select login_id, full_name, branch_name, role, is_approved, manager_code
      from public.profiles
      where manager_code = $1
        and role = 'manager'
        and is_approved = true
      limit 1
    `,
    [code],
  );

  const profile = profileRows[0];
  if (!profile) {
    return NextResponse.json(
      { message: "일치하는 가입 이력을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const isNameMatched = normalizeName(profile.full_name ?? "") === normalizeName(name);
  const isBranchMatched = (profile.branch_name ?? "").trim() === branch;

  if (!isNameMatched || !isBranchMatched) {
    return NextResponse.json(
      { message: "입력한 정보가 가입 이력과 일치하지 않습니다." },
      { status: 403 },
    );
  }

  const authRows = await query<{ login_id: string }>(
    "select login_id from public.auth_users where login_id = $1 limit 1",
    [profile.login_id],
  );

  if (authRows.length === 0) {
    return NextResponse.json(
      { message: "로그인 계정을 찾을 수 없습니다. 관리자에게 문의해주세요." },
      { status: 404 },
    );
  }

  await query(
    "update public.auth_users set password = $1, must_change_password = false where login_id = $2",
    [newPassword, profile.login_id],
  );

  return NextResponse.json({
    status: "ok",
    message: "새 비밀번호가 등록되었습니다. 매니저 로그인으로 접속해주세요.",
  });
}
