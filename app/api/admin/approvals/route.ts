import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";
import { getCurrentUser } from "@/src/lib/engines/auth";

type ProfileRow = {
  id: string;
  login_id: string;
  branch_name: string | null;
};

export async function POST(req: NextRequest) {
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

  const { profileId, action } = (await req.json()) as {
    profileId?: string;
    action?: "approve" | "reject";
  };

  if (!profileId || !action || !["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { message: "profileId와 action(approve|reject)을 보내주세요." },
      { status: 400 },
    );
  }

  const branchName = user.profile.branch_name;

  const rows = await query<ProfileRow>(
    "select id, login_id, branch_name from public.profiles where id = $1",
    [profileId],
  );
  const profile = rows[0];
  if (!profile) {
    return NextResponse.json({ message: "해당 신청을 찾을 수 없습니다." }, { status: 404 });
  }
  if (profile.branch_name !== branchName) {
    return NextResponse.json({ message: "본인 지점의 신청만 처리할 수 있습니다." }, { status: 403 });
  }

  try {
    if (action === "approve") {
      await query(
        "update public.profiles set is_approved = true where id = $1",
        [profileId],
      );
      return NextResponse.json({ ok: true, message: "승인되었습니다." });
    }

    // reject: 로그인 불가 처리 후 프로필 삭제(목록에서 제외, 재신청 가능)
    await query("delete from public.auth_users where login_id = $1", [profile.login_id]);
    await query("delete from public.profiles where id = $1", [profileId]);
    return NextResponse.json({ ok: true, message: "거절 처리되었습니다." });
  } catch (err) {
    console.error("[admin/approvals]", err);
    return NextResponse.json(
      { message: "처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
