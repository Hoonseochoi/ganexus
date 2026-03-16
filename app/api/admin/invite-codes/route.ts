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

    // 지점당 초대코드는 1개만 허용한다.
    const existing = await query<{ id: string }>(
      `
        select id
        from public.invite_codes
        where branch_name = $1
        limit 1
      `,
      [profile.branch_name],
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "이미 생성된 초대 코드가 있습니다. 기존 코드를 삭제한 뒤 다시 시도해주세요." },
        { status: 400 },
      );
    }

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

export async function DELETE(req: NextRequest) {
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

    const { id } = (await req.json().catch(() => ({}))) as { id?: string };
    if (!id) {
      return NextResponse.json({ message: "삭제할 초대 코드 ID가 필요합니다." }, { status: 400 });
    }

    const result = await query<{ id: string }>(
      `
        delete from public.invite_codes
        where id = $1 and branch_name = $2
        returning id
      `,
      [id, profile.branch_name],
    );

    if (result.length === 0) {
      return NextResponse.json(
        { message: "해당 지점에서 찾을 수 없는 초대 코드입니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("[admin/invite-codes DELETE]", err);
    return NextResponse.json(
      { message: "초대 코드 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

