import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { updateMemo, deleteMemo } from "@/src/lib/engines/memos";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const branchName = user.profile?.branch_name;
  const profileId = user.profile?.id;
  if (!branchName || !profileId) {
    return NextResponse.json({ message: "지점 정보가 없습니다." }, { status: 400 });
  }

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { content?: string };
  if (!body.content?.trim()) {
    return NextResponse.json({ message: "메모 내용을 입력해주세요." }, { status: 400 });
  }

  const isAdmin = user.role === "admin";
  const updated = await updateMemo({
    id,
    branchName,
    content: body.content.trim(),
    createdBy: isAdmin ? undefined : profileId,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "메모를 찾을 수 없거나 수정 권한이 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ memo: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const branchName = user.profile?.branch_name;
  const profileId = user.profile?.id;
  if (!branchName || !profileId) {
    return NextResponse.json({ message: "지점 정보가 없습니다." }, { status: 400 });
  }

  const { id } = await params;
  const isAdmin = user.role === "admin";
  const deleted = await deleteMemo({
    id,
    branchName,
    createdBy: isAdmin ? undefined : profileId,
  });

  if (!deleted) {
    return NextResponse.json(
      { message: "메모를 찾을 수 없거나 삭제 권한이 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
