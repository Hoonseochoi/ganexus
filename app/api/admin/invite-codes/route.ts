import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentUser } from "@/src/lib/engines/auth";

function generateCode(branchName: string) {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const prefix =
    branchName
      .replace(/\s+/g, "_")
      .replace(/[^A-Za-z0-9_]/g, "")
      .toUpperCase() || "MERITZ";
  return `${prefix}-${suffix}`;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    if (!user.profile?.branch_name) {
      return NextResponse.json(
        { message: "지점 정보가 설정되지 않았습니다." },
        { status: 400 },
      );
    }

    const rows = await query(
      `
      select id, code, branch_name, max_uses, used_count, expires_at, created_at
      from public.invite_codes
      where branch_name = $1
      order by created_at desc
    `,
      [user.profile.branch_name],
    );

    return NextResponse.json({ codes: rows });
  } catch (err) {
    console.error("[admin/invite-codes GET]", err);
    return NextResponse.json(
      { message: "초대 코드 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
    }

    const profile = user.profile;
    if (!profile?.branch_name) {
      return NextResponse.json(
        { message: "지점 정보가 설정되지 않았습니다. 먼저 지점 설정을 완료해주세요." },
        { status: 400 },
      );
    }

    const { maxUses, expiresAt } = (await req.json().catch(() => ({}))) as {
      maxUses?: number;
      expiresAt?: string;
    };

    const code = generateCode(profile.branch_name);

    const rows = await query(
      `
      insert into public.invite_codes (code, branch_name, created_by, max_uses, expires_at)
      values ($1, $2, $3, $4, $5)
      returning id, code, branch_name, max_uses, used_count, expires_at, created_at
    `,
      [
        code,
        profile.branch_name,
        profile.id,
        maxUses ?? null,
        expiresAt ?? null,
      ],
    );

    return NextResponse.json({ code: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[admin/invite-codes POST]", err);
    return NextResponse.json(
      { message: "초대 코드 생성 중 오류가 발생했습니다. DB 테이블(profiles, invite_codes)이 있는지 확인해주세요." },
      { status: 500 },
    );
  }
}

