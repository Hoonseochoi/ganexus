import { NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentUser } from "@/src/lib/engines/auth";

type PendingProfileRow = {
  id: string;
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  created_at: string;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  if (!user.profile?.branch_name) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다. 먼저 지점 설정을 완료해주세요." },
      { status: 400 },
    );
  }

  const rows = await query<PendingProfileRow>(
    `
    select id, login_id, full_name, branch_name, birth_date, phone_number, created_at
    from public.profiles
    where is_approved = false
      and branch_name = $1
    order by created_at desc
    `,
    [user.profile.branch_name],
  );

  return NextResponse.json({ agents: rows });
}
