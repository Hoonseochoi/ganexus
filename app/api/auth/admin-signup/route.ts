import { NextRequest, NextResponse } from "next/server";
import { query, isColumnNotFound } from "@/src/lib/engines/db";
import { createTenantForAdmin } from "@/src/lib/engines/tenant";

/**
 * 관리자 회원가입 (비인증 공개)
 * - auth_users: login_id = 사번, password = 사번, role = 'admin', must_change_password = true
 * - profiles: full_name, branch_name, phone_number, role = 'admin', company, email
 * 최초 로그인: ID·PW 모두 사번 입력 → 비밀번호 변경 후 대시보드 진입
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      company?: string;
      fullName?: string;
      branchName?: string;
      employeeCode?: string;
      phoneNumber?: string;
      email?: string;
    };

    const company = (body.company ?? "").trim();
    const fullName = (body.fullName ?? "").trim();
    const branchName = (body.branchName ?? "").trim();
    const employeeCode = (body.employeeCode ?? "").trim();
    const phoneNumber = (body.phoneNumber ?? "").trim();
    const email = (body.email ?? "").trim();

    if (!employeeCode) {
      return NextResponse.json(
        { message: "사번 코드를 입력해주세요." },
        { status: 400 },
      );
    }
    if (!fullName) {
      return NextResponse.json(
        { message: "성함을 입력해주세요." },
        { status: 400 },
      );
    }
    if (!branchName) {
      return NextResponse.json(
        { message: "지점명을 입력해주세요." },
        { status: 400 },
      );
    }
    if (!phoneNumber) {
      return NextResponse.json(
        { message: "휴대폰 번호를 입력해주세요." },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { message: "이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    const existing = await query<{ login_id: string }>(
      "select login_id from public.auth_users where login_id = $1",
      [employeeCode],
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { message: "이미 사용 중인 사번입니다." },
        { status: 409 },
      );
    }

    await query(
      `insert into public.auth_users (login_id, password, role, must_change_password)
       values ($1, $2, 'admin', true)`,
      [employeeCode, employeeCode],
    );

    let profileId: string;
    try {
      const profileRows = await query<{ id: string }>(
        `insert into public.profiles (login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
         values ($1, $2, $3, $4, 'admin', true, $5, $6)
         returning id`,
        [
          employeeCode,
          fullName,
          branchName,
          phoneNumber.replace(/-/g, ""),
          company || null,
          email || null,
        ],
      );
      profileId = profileRows[0].id;
    } catch (profileErr) {
      if (isColumnNotFound(profileErr)) {
        const profileRows = await query<{ id: string }>(
          `insert into public.profiles (login_id, full_name, branch_name, phone_number, role, is_approved)
           values ($1, $2, $3, $4, 'admin', true)
           returning id`,
          [employeeCode, fullName, branchName, phoneNumber.replace(/-/g, "")],
        );
        profileId = profileRows[0].id;
      } else {
        throw profileErr;
      }
    }

    try {
      await createTenantForAdmin({
        employeeCode,
        branchName,
        fullName,
        phoneNumber: phoneNumber.replace(/-/g, ""),
        company: company || null,
        email: email || null,
        profileId,
      });
    } catch (tenantErr) {
      console.error("[auth/admin-signup] tenant 생성 실패", tenantErr);
      return NextResponse.json(
        { message: "테넌트 생성 중 오류가 발생했습니다. 관리자에게 문의해주세요." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "ok",
      message: "가입이 완료되었습니다. 로그인에서 사번(ID·PW 동일)으로 접속 후 비밀번호를 변경해주세요.",
    });
  } catch (err) {
    console.error("[auth/admin-signup]", err);
    return NextResponse.json(
      { message: "가입 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 },
    );
  }
}
