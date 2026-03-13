import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { getNoticeById, markNoticeRead } from "@/src/lib/engines/notices";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const profile = user.profile;
  if (!profile?.id) {
    return NextResponse.json(
      { message: "프로필이 없습니다." },
      { status: 400 },
    );
  }

  const { id: noticeId } = await params;
  const notice = await getNoticeById(noticeId, profile.branch_name ?? "");
  if (!notice) {
    return NextResponse.json({ message: "공지를 찾을 수 없습니다." }, { status: 404 });
  }

  await markNoticeRead({
    branchName: profile.branch_name ?? "",
    noticeId,
    profileId: profile.id,
  });
  return NextResponse.json({ ok: true });
}
