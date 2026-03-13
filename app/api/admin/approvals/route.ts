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

  const { profileId, action, managerCode } = (await req.json()) as {
    profileId?: string;
    action?: "approve" | "reject";
    managerCode?: string;
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
      const code = (managerCode ?? "").trim();

      if (code !== "") {
        // 매니저코드가 있으면: auth_users·profiles 를 매니저코드(id/pw)로 바꾸고 role=manager, 승인
        const existing = await query(
          "select 1 from public.auth_users where login_id = $1",
          [code],
        );
        if (existing.length > 0) {
          return NextResponse.json(
            { message: "이미 사용 중인 매니저 코드입니다." },
            { status: 409 },
          );
        }
        await query(
          `update public.auth_users
           set login_id = $1, password = $1, role = 'manager', must_change_password = true
           where login_id = $2`,
          [code, profile.login_id],
        );
        await query(
          `update public.profiles
           set login_id = $1, role = 'manager', manager_code = $2, is_approved = true
           where id = $3`,
          [code, code, profileId],
        );
        return NextResponse.json({
          ok: true,
          message: "매니저로 승인되었습니다. 해당 매니저코드로 로그인할 수 있습니다.",
        });
      }

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
