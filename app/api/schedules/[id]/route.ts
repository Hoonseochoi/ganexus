import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { updateSchedule, deleteSchedule } from "@/src/lib/engines/schedules";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "일정 수정은 관리자만 가능합니다." },
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

  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    description?: string | null;
    category?: "education" | "vacation" | "hq" | "etc";
    startAt?: string;
    endAt?: string;
    isAllDay?: boolean;
  };

  const updated = await updateSchedule({
    id,
    branchName,
    title: body.title,
    description: body.description,
    category: body.category,
    startAt: body.startAt,
    endAt: body.endAt,
    isAllDay: body.isAllDay,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "해당 일정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ schedule: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "일정 삭제는 관리자만 가능합니다." },
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

  await deleteSchedule({ id, branchName });
  return NextResponse.json({ ok: true });
}

