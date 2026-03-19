import { NextRequest, NextResponse } from "next/server";
import { addProfileToTenant, getTenantSchemaForBranch } from "@/src/lib/engines/tenant";
import { isRelationNotFound, pool, query } from "@/src/lib/engines/db";

type InviteRow = {
  id: string;
  branch_name: string;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
};

type RegistryRow = {
  manager_code: string;
  manager_name: string;
  branch_name: string;
  is_active: boolean;
  claimed_profile_id: string | null;
};

type ProfileUpsertRow = {
  id: string;
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
  is_approved: boolean;
  manager_code: string | null;
};

function normalizeName(value: string): string {
  return value.replace(/\s+/g, "").trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const { code, fullName, birthDate, phoneNumber, managerCode } = (await req.json()) as {
    code?: string;
    fullName?: string;
    birthDate?: string;
    phoneNumber?: string;
    managerCode?: string;
  };

  // 필수 필드 검증
  if (!code || !fullName || !birthDate || !phoneNumber) {
    return NextResponse.json(
      { message: "초대 코드, 성함, 생년월일, 휴대폰 번호를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  const managerCodeTrimmed = (managerCode ?? "").trim();
  if (!managerCodeTrimmed) {
    return NextResponse.json(
      { message: "매니저 코드를 입력해주세요." },
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

  const inviteRows = await query<InviteRow>(
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

  const client = await pool.connect();
  let createdProfile: ProfileUpsertRow | null = null;
  let autoApproved = false;
  let effectiveLoginId = "";

  try {
    await client.query("begin");

    effectiveLoginId = managerCodeTrimmed;

    const existingAuth = await client.query(
      "select 1 from public.auth_users where login_id = $1",
      [managerCodeTrimmed],
    );
    if (existingAuth.rowCount && existingAuth.rowCount > 0) {
      await client.query("rollback");
      return NextResponse.json(
        { message: "이미 사용 중인 매니저 코드입니다. 다른 코드를 입력해주세요." },
        { status: 409 },
      );
    }

    const existingProfileByCode = await client.query<{ login_id: string }>(
      "select login_id from public.profiles where manager_code = $1 or login_id = $1 limit 1",
      [managerCodeTrimmed],
    );
    if ((existingProfileByCode.rowCount ?? 0) > 0) {
      await client.query("rollback");
      return NextResponse.json(
        { message: "이미 사용 중인 매니저 코드입니다. 다른 코드를 입력해주세요." },
        { status: 409 },
      );
    }

    let registryMatch: RegistryRow | null = null;
    let codeAndBranchMatched = false;
    let nameMatched = false;
    try {
      const registryRows = await client.query<RegistryRow>(
        `
          select manager_code, manager_name, branch_name, is_active, claimed_profile_id
          from public.manager_code_registry
          where manager_code = $1
          limit 1
        `,
        [managerCodeTrimmed],
      );
      const candidate = registryRows.rows[0] ?? null;
      if (
        candidate &&
        candidate.is_active &&
        candidate.claimed_profile_id === null &&
        candidate.branch_name === invite.branch_name
      ) {
        codeAndBranchMatched = true;
        nameMatched = normalizeName(fullName) === normalizeName(candidate.manager_name);
        if (nameMatched) {
          registryMatch = candidate;
        }
      }
    } catch (err) {
      if (!isRelationNotFound(err)) throw err;
      // 레지스트리 테이블이 아직 없으면 기존 승인 대기 플로우 유지
      registryMatch = null;
    }

    if (codeAndBranchMatched && !nameMatched) {
      await client.query("rollback");
      return NextResponse.json(
        { message: "이름과 코드가 일치하지않습니다." },
        { status: 400 },
      );
    }

    autoApproved = registryMatch !== null;

    await client.query(
      `
        insert into public.auth_users (login_id, password, role, must_change_password, branch_name, invite_code)
        values ($1, $2, 'manager', true, $3, $4)
        on conflict (login_id)
        do update set role = 'manager',
                     must_change_password = true,
                     password = $2,
                     branch_name = $3,
                     invite_code = $4
      `,
      [managerCodeTrimmed, managerCodeTrimmed, invite.branch_name, code],
    );

    const upsertedProfile = await client.query<ProfileUpsertRow>(
      `
        insert into public.profiles (login_id, full_name, branch_name, birth_date, phone_number, role, is_approved, manager_code, invite_code)
        values ($1, $2, $3, $4, $5, 'manager', $6, $1, $7)
        on conflict (login_id)
        do update set full_name = excluded.full_name,
                    branch_name = excluded.branch_name,
                    birth_date = excluded.birth_date,
                    phone_number = excluded.phone_number,
                    role = 'manager',
                    is_approved = excluded.is_approved,
                    manager_code = excluded.manager_code,
                    invite_code = excluded.invite_code
        returning id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code
      `,
      [managerCodeTrimmed, fullName, invite.branch_name, birthDate, phoneDigits, autoApproved, code],
    );
    createdProfile = upsertedProfile.rows[0] ?? null;

    if (autoApproved && createdProfile) {
      const claimResult = await client.query(
        `
          update public.manager_code_registry
          set claimed_profile_id = $2,
              claimed_at = timezone('utc'::text, now()),
              updated_at = timezone('utc'::text, now())
          where manager_code = $1
            and branch_name = $3
            and is_active = true
            and claimed_profile_id is null
        `,
        [managerCodeTrimmed, createdProfile.id, invite.branch_name],
      );

      if ((claimResult.rowCount ?? 0) === 0) {
        throw new Error("MANAGER_CODE_ALREADY_CLAIMED");
      }
    }

    await client.query(
      "update public.invite_codes set used_count = used_count + 1 where id = $1",
      [invite.id],
    );

    await client.query("commit");
  } catch (err) {
    await client.query("rollback");
    if (err instanceof Error && err.message === "MANAGER_CODE_ALREADY_CLAIMED") {
      return NextResponse.json(
        { message: "이미 사용된 사전등록 매니저 코드입니다. 관리자에게 문의해주세요." },
        { status: 409 },
      );
    }
    if (
      err !== null &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { message: "이미 사용 중인 매니저 코드입니다. 다른 코드를 입력해주세요." },
        { status: 409 },
      );
    }
    console.error("[agent/apply] signup failed", err);
    return NextResponse.json(
      { message: "가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  } finally {
    client.release();
  }

  if (autoApproved && createdProfile) {
    try {
      const tenantSchema = await getTenantSchemaForBranch(invite.branch_name);
      if (tenantSchema) {
        await addProfileToTenant({
          tenantSchema,
          profileId: createdProfile.id,
          loginId: createdProfile.login_id,
          fullName: createdProfile.full_name,
          branchName: createdProfile.branch_name,
          phoneNumber: createdProfile.phone_number,
          role: createdProfile.role,
          isApproved: true,
          managerCode: createdProfile.manager_code,
        });
      }
    } catch (tenantSyncErr) {
      console.error("[agent/apply] tenant sync failed after auto-approval", tenantSyncErr);
    }
  }

  return NextResponse.json({
    status: "ok",
    loginId: effectiveLoginId,
    autoApproved,
    message: autoApproved
      ? "사전등록된 매니저 코드가 확인되어 즉시 승인되었습니다. 매니저 코드(ID·PW 동일)로 바로 로그인할 수 있습니다."
      : "지점장 승인 후 매니저 로그인에서 해당 코드(ID·PW 동일)로 접속할 수 있습니다.",
  });
}

