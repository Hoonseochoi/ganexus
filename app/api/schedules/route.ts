import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  createSchedule,
  listSchedulesForBranch,
  checkScheduleConflicts,
} from "@/src/lib/engines/schedules";
import { buildCalendarMonthData, getCalendarFetchRange } from "@/src/lib/calendar/month-view";

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
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
  const requestedYear = Number(searchParams.get("year"));
  const requestedMonth = Number(searchParams.get("month"));
  const hasMonthRequest = Number.isInteger(requestedYear) && Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12;

  let from = searchParams.get("from") ?? undefined;
  let to = searchParams.get("to") ?? undefined;

  if (hasMonthRequest && (!from || !to)) {
    const range = getCalendarFetchRange(requestedYear, requestedMonth - 1);
    from = from ?? range.from;
    to = to ?? range.to;
  }

  const allSchedules = await listSchedulesForBranch({
    branchName,
    from,
    to,
  });

  const profileId = user.profile?.id;
  const schedules = allSchedules.filter(
    (s) => !s.is_private || s.created_by === profileId
  );

  const elapsedMs = Date.now() - startedAt;

  const payload: {
    schedules: Awaited<ReturnType<typeof listSchedulesForBranch>>;
    monthData?: ReturnType<typeof buildCalendarMonthData>;
  } = { schedules };

  if (hasMonthRequest) {
    payload.monthData = buildCalendarMonthData({
      year: requestedYear,
      month: requestedMonth - 1,
      schedules,
    });
  }

  return NextResponse.json(
    payload,
    {
      headers: {
        "Cache-Control": "private, max-age=30",
        "Server-Timing": `app;dur=${elapsedMs}`,
        "X-Response-Time": `${elapsedMs}ms`,
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  // 일정 생성: admin / manager / agent(승인된 에이전트) 동일 권한
  const canCreateSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
  if (!canCreateSchedule) {
    return NextResponse.json(
      { message: "일정 생성 권한이 없습니다." },
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
    isPrivate?: boolean;
    dealerName?: string | null;
    location?: string | null;
    instructor?: string | null;
    targetAudience?: string | null;
    managerName?: string | null;
    recurrenceRule?: string;
  };

  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: "제목을 입력해주세요." },
      { status: 400 },
    );
  }

  const now = new Date();
  const startAt = body.startAt ?? new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();

  const endAt = body.endAt ?? startAt;

  // 충돌 감지 (경고만, 등록 차단 안 함)
  const conflictRows = await checkScheduleConflicts({
    branchName: profile.branch_name,
    startAt,
    endAt,
  });

  const created = await createSchedule({
    branchName: profile.branch_name,
    title: body.title.trim(),
    description: body.description ?? null,
    category: body.category,
    startAt,
    endAt: body.endAt,
    isAllDay: body.isAllDay ?? false,
    isPrivate: body.isPrivate ?? false,
    dealerName: body.dealerName ?? null,
    location: body.location ?? null,
    instructor: body.instructor ?? null,
    targetAudience: body.targetAudience ?? null,
    managerName: body.managerName ?? null,
    recurrenceRule: body.recurrenceRule,
    createdByProfileId: profile.id,
  });

  const response: Record<string, unknown> = { schedule: created };

  if (conflictRows.length > 0) {
    response.conflicts = conflictRows.map((c) => ({
      id: c.id,
      title: c.title,
      start_at: c.start_at,
      end_at: c.end_at,
    }));
    response.warning = `겹치는 일정이 ${conflictRows.length}건 있습니다`;
  }

  return NextResponse.json(response, { status: 201 });
}

