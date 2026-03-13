import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { listAllBranchMembers } from "@/src/lib/engines/managers";

export async function GET(_req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const canListMembers = user.role === "admin" || user.role === "manager" || user.role === "agent";
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
  });
}

