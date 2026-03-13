import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { listAllBranchMembers } from "@/src/lib/engines/managers";
import { query } from "@/src/lib/engines/db";
import { getTenantSchemaForBranch } from "@/src/lib/engines/tenant";

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const canListMembers = user.role === "admin" || user.role === "manager";
  if (!canListMembers) {
    return NextResponse.json(
      { message: "매니저 리스트 조회 권한이 없습니다." },
      { status: 403 },
    );
  }

  const branchName = user.profile?.branch_name;
  if (!branchName) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const members = await listAllBranchMembers(branchName);

  return NextResponse.json({
    managers: members.map((m) => ({
      id: m.id,
      name: m.full_name ?? "이름 없음",
      branch_name: m.branch_name,
      phone_number: m.phone_number,
      role: m.role,
      created_at: m.created_at,
    })),
    canEdit: user.role === "admin",
    currentUserId: user.profile?.id ?? null,
  });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "멤버 삭제는 관리자만 가능합니다." },
      { status: 403 },
    );
  }

  const branchName = user.profile?.branch_name;
  if (!branchName) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const { memberId } = (await req.json().catch(() => ({}))) as {
    memberId?: string;
  };

  if (!memberId) {
    return NextResponse.json(
      { message: "멤버 ID가 필요합니다." },
      { status: 400 },
    );
  }

  if (user.profile?.id === memberId) {
    return NextResponse.json(
      { message: "자기 자신은 삭제할 수 없습니다." },
      { status: 400 },
    );
  }

  // 해당 지점 멤버인지, Admin 이 아닌지 확인
  const profileRows = await query<{
    id: string;
    login_id: string;
    role: string | null;
  }>(
    `
      select id, login_id, role
      from public.profiles
      where id = $1 and branch_name = $2
    `,
    [memberId, branchName],
  );

  const target = profileRows[0];
  if (!target) {
    return NextResponse.json(
      { message: "해당 지점에서 찾을 수 없는 멤버입니다." },
      { status: 404 },
    );
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { message: "관리자 계정은 여기서 삭제할 수 없습니다." },
      { status: 400 },
    );
  }

  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";

  // auth_users, tenant 프로필, public 프로필 순서로 삭제
  await query(
    `
      delete from public.auth_users
      where login_id = $1
    `,
    [target.login_id],
  );

  await query(
    `delete from ${schema}.profiles where id = $1`,
    [memberId],
  );

  await query(
    "delete from public.profiles where id = $1",
    [memberId],
  );

  return NextResponse.json({ status: "ok" });
}

