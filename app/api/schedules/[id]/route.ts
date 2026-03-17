import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  updateSchedule,
  deleteSchedule,
  getScheduleById,
} from "@/src/lib/engines/schedules";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const canEditSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
  if (!canEditSchedule) {
    return NextResponse.json(
      { message: "일정 수정 권한이 없습니다." },
      { status: 403 },
    );
  }

  const branchName = user.profile?.branch_name;
  const profileId = user.profile?.id;
  const fullName = user.profile?.full_name ?? null;
  if (!branchName || !profileId) {
    return NextResponse.json(
      { message: "지점 정보 또는 프로필 정보가 설정되지 않았습니다." },
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

  const updated = await updateSchedule({
    id,
    branchName,
    modifiedBy: profileId,
    modifiedByName: fullName,
    title: body.title,
    description: body.description,
    category: body.category,
    startAt: body.startAt,
    endAt: body.endAt,
    isAllDay: body.isAllDay,
    dealerName: body.dealerName,
    location: body.location,
    instructor: body.instructor,
    targetAudience: body.targetAudience,
    managerName: body.managerName,
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

  const canDeleteSchedule = user.role === "admin" || user.role === "manager" || user.role === "agent";
  if (!canDeleteSchedule) {
    return NextResponse.json(
      { message: "일정 삭제 권한이 없습니다." },
      { status: 403 },
    );
  }

  const branchName = user.profile?.branch_name;
  const profileId = user.profile?.id;
  if (!branchName || !profileId) {
    return NextResponse.json(
      { message: "지점 정보가 설정되지 않았습니다." },
      { status: 400 },
    );
  }

  const schedule = await getScheduleById({ id, branchName });
  if (!schedule) {
    return NextResponse.json(
      { message: "해당 일정을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  const isAuthor = String(schedule.created_by) === String(profileId);
  if (!isAuthor && user.role !== "admin") {
    return NextResponse.json(
      { message: "일정 삭제 권한이 없습니다." },
      { status: 403 },
    );
  }

  await deleteSchedule({
    id,
    branchName,
    hardDelete: user.role === "admin",
  });
  return NextResponse.json({ ok: true });
}

