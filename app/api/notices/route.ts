import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  getLatestNoticeForBranch,
  createNotice,
  hasReadNotice,
} from "@/src/lib/engines/notices";

export async function GET() {
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

  const notice = await getLatestNoticeForBranch(branchName);
  let readByMe = false;
  if (notice && user.profile?.id) {
    readByMe = await hasReadNotice(notice.id, user.profile.id);
  }
  return NextResponse.json({ notice, readByMe });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "공지사항 작성은 관리자만 가능합니다." },
      { status: 403 },
    );
  }

  const profile = user.profile;
  if (!profile?.branch_name || !profile.id) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    body?: string | null;
    imageUrl?: string | null;
  };

  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: "제목을 입력해주세요." },
      { status: 400 },
    );
  }

  const created = await createNotice({
    branchName: profile.branch_name,
    title: body.title.trim(),
    body: body.body?.trim() ?? null,
    imageUrl: body.imageUrl ?? null,
    createdByProfileId: profile.id,
  });

  return NextResponse.json({ notice: created }, { status: 201 });
}
