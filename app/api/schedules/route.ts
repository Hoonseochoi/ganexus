import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  createSchedule,
  listSchedulesForBranch,
} from "@/src/lib/engines/schedules";

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
  const from = searchParams.get("from") ?? undefined;
  const to = searchParams.get("to") ?? undefined;

  const schedules = await listSchedulesForBranch({
    branchName,
    from,
    to,
  });

  return NextResponse.json({ schedules });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  // 일정 생성은 우선 Admin 전용으로 제한
  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "일정 생성은 관리자만 가능합니다." },
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
    description?: string | null;
    category?: "dealer" | "internal" | "personal" | "leave" | "etc";
    startAt?: string;
    endAt?: string;
    isAllDay?: boolean;
    dealerName?: string | null;
    location?: string | null;
    instructor?: string | null;
    targetAudience?: string | null;
    managerName?: string | null;
  };

  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: "제목을 입력해주세요." },
      { status: 400 },
    );
  }

  const now = new Date();
  const startAt = body.startAt ?? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();

  const created = await createSchedule({
    branchName: profile.branch_name,
    title: body.title.trim(),
    description: body.description ?? null,
    category: body.category,
    startAt,
    endAt: body.endAt,
    isAllDay: body.isAllDay ?? false,
    dealerName: body.dealerName ?? null,
    location: body.location ?? null,
    instructor: body.instructor ?? null,
    targetAudience: body.targetAudience ?? null,
    managerName: body.managerName ?? null,
    createdByProfileId: profile.id,
  });

  return NextResponse.json({ schedule: created }, { status: 201 });
}

