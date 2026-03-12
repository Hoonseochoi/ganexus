import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentSession } from "@/src/lib/engines/session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const rows = await query(
    "select id, login_id, full_name, branch_name from public.profiles where login_id = $1",
    [session.loginId],
  );

  const profile = rows[0] ?? null;
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const { fullName, branchName } = (await req.json()) as {
    fullName?: string;
    branchName?: string;
  };

  if (!fullName || !branchName) {
    return NextResponse.json(
      { message: "지점명과 이름을 모두 입력해주세요." },
      { status: 400 },
    );
  }

  await query(
    `
      insert into public.profiles (login_id, full_name, branch_name, role, is_approved)
      values ($1, $2, $3, 'admin', true)
      on conflict (login_id)
      do update set full_name = excluded.full_name, branch_name = excluded.branch_name, role = 'admin'
    `,
    [session.loginId, fullName, branchName],
  );

  return NextResponse.json({ status: "ok" });
}

