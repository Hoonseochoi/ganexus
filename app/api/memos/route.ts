import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { listMemosForBranch, createMemo } from "@/src/lib/engines/memos";

export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? undefined;

  const memos = await listMemosForBranch({ branchName, date });
  return NextResponse.json({ memos });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const profile = user.profile;
  if (!profile?.branch_name || !profile.id) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as { content?: string };
  if (!body.content?.trim()) {
    return NextResponse.json(
      { message: "메모 내용을 입력해주세요." },
      { status: 400 },
    );
  }

  const created = await createMemo({
    branchName: profile.branch_name,
    content: body.content.trim(),
    createdByProfileId: profile.id,
  });

  return NextResponse.json({ memo: created }, { status: 201 });
}
