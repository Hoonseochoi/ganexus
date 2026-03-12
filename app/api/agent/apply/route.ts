import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

export async function POST(req: NextRequest) {
  const { code, fullName, birthDate, phoneNumber } = (await req.json()) as {
    code?: string;
    fullName?: string;
    birthDate?: string;
    phoneNumber?: string;
  };

  if (!code || !fullName || !birthDate || !phoneNumber) {
    return NextResponse.json(
      { message: "초대 코드와 기본 정보를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  const phoneDigits = phoneNumber.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    return NextResponse.json(
      { message: "휴대폰 번호 형식이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  if (!/^[0-9]{6}$/.test(birthDate)) {
    return NextResponse.json(
      { message: "생년월일은 YYMMDD 6자리로 입력해주세요." },
      { status: 400 },
    );
  }

  const inviteRows = await query<{
    id: string;
    branch_name: string;
    max_uses: number | null;
    used_count: number;
    expires_at: string | null;
  }>(
    "select * from public.invite_codes where code = $1",
    [code],
  );

  const invite = inviteRows[0];
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

  const loginId = phoneDigits;
  const initialPassword = birthDate;

  await query(
    `
      insert into public.auth_users (login_id, password, role, must_change_password)
      values ($1, $2, 'agent', true)
      on conflict (login_id)
      do update set role = 'agent', must_change_password = true
    `,
    [loginId, initialPassword],
  );

  await query(
    `
      insert into public.profiles (login_id, full_name, branch_name, birth_date, phone_number, role, is_approved)
      values ($1, $2, $3, $4, $5, 'agent', false)
      on conflict (login_id)
      do update set full_name = excluded.full_name,
                  branch_name = excluded.branch_name,
                  birth_date = excluded.birth_date,
                  phone_number = excluded.phone_number,
                  role = 'agent'
    `,
    [loginId, fullName, invite.branch_name, birthDate, phoneDigits],
  );

  await query(
    "update public.invite_codes set used_count = used_count + 1 where id = $1",
    [invite.id],
  );

  return NextResponse.json({
    status: "ok",
    loginId,
    initialPassword,
    message: "지점장 승인 후 내부 로그인 페이지에서 접속할 수 있습니다.",
  });
}

