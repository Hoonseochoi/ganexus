import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { getNoticeById, updateNotice } from "@/src/lib/engines/notices";

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

  return NextResponse.json({ notice });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "공지사항 수정은 관리자만 가능합니다." },
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

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    body?: string | null;
    imageUrl?: string | null;
  };

  const updated = await updateNotice({
    id,
    branchName,
    title: body.title,
    body: body.body,
    imageUrl: body.imageUrl,
  });

  if (!updated) {
    return NextResponse.json({ message: "공지를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ notice: updated });
}
