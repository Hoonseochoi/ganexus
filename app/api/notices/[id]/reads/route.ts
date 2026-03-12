import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { getNoticeById, getNoticeReads } from "@/src/lib/engines/notices";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const branchName = user.profile?.branch_name;
  if (!branchName) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const notice = await getNoticeById(id, branchName);
  if (!notice) {
    return NextResponse.json({ message: "공지를 찾을 수 없습니다." }, { status: 404 });
  }

  const reads = await getNoticeReads(id);
  return NextResponse.json({ reads });
}
