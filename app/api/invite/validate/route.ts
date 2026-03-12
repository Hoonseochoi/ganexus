import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

type InviteRow = {
  id: string;
  code: string;
  branch_name: string;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
};

export async function POST(req: NextRequest) {
  const { code } = (await req.json()) as { code?: string };

  if (!code) {
    return NextResponse.json(
      { message: "초대 코드를 입력해주세요." },
      { status: 400 },
    );
  }

  const rows = await query<InviteRow>(
    `
      select *
      from public.invite_codes
      where code = $1
    `,
    [code],
  );

  const invite = rows[0];
  if (!invite) {
    return NextResponse.json(
      { message: "유효하지 않은 초대 코드입니다." },
      { status: 404 },
    );
  }

  const now = Date.now();
  if (
    invite.expires_at &&
    new Date(invite.expires_at).getTime() < now
  ) {
    return NextResponse.json(
      { message: "만료된 초대 코드입니다." },
      { status: 410 },
    );
  }

  if (
    invite.max_uses !== null &&
    invite.used_count >= invite.max_uses
  ) {
    return NextResponse.json(
      { message: "사용 가능한 횟수를 모두 소진한 초대 코드입니다." },
      { status: 409 },
    );
  }

  return NextResponse.json({
    code: invite.code,
    branchName: invite.branch_name,
    remainingUses:
      invite.max_uses === null
        ? null
        : Math.max(invite.max_uses - invite.used_count, 0),
  });
}

