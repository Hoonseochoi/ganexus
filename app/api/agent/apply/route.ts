import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

export async function POST(req: NextRequest) {
  const { code, fullName, birthDate, phoneNumber, managerCode } = (await req.json()) as {
    code?: string;
    fullName?: string;
    birthDate?: string;
    phoneNumber?: string;
    managerCode?: string;
  };

  const managerCodeTrimmed = (managerCode ?? "").trim();
  if (!code || !fullName || !birthDate || !phoneNumber || !managerCodeTrimmed) {
    return NextResponse.json(
      { message: "매니저 코드, 초대 코드, 성함, 생년월일, 휴대폰 번호를 모두 입력해주세요." },
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

  const existingAuth = await query(
    "select 1 from public.auth_users where login_id = $1",
    [managerCodeTrimmed],
  );
  if (existingAuth.length > 0) {
    return NextResponse.json(
      { message: "이미 사용 중인 매니저 코드입니다. 다른 코드를 입력해주세요." },
      { status: 409 },
    );
  }

  await query(
    `
      insert into public.auth_users (login_id, password, role, must_change_password)
      values ($1, $2, 'manager', true)
      on conflict (login_id)
      do update set role = 'manager', must_change_password = true, password = $2
    `,
    [managerCodeTrimmed, managerCodeTrimmed],
  );

  await query(
    `
      insert into public.profiles (login_id, full_name, branch_name, birth_date, phone_number, role, is_approved, manager_code)
      values ($1, $2, $3, $4, $5, 'manager', false, $1)
      on conflict (login_id)
      do update set full_name = excluded.full_name,
                  branch_name = excluded.branch_name,
                  birth_date = excluded.birth_date,
                  phone_number = excluded.phone_number,
                  role = 'manager',
                  manager_code = excluded.manager_code
    `,
    [managerCodeTrimmed, fullName, invite.branch_name, birthDate, phoneDigits],
  );

  await query(
    "update public.invite_codes set used_count = used_count + 1 where id = $1",
    [invite.id],
  );

  return NextResponse.json({
    status: "ok",
    loginId: managerCodeTrimmed,
    message: "지점장 승인 후 매니저 로그인에서 해당 코드(ID·PW 동일)로 접속할 수 있습니다.",
  });
}

