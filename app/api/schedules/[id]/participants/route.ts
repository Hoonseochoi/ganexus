import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  getScheduleParticipants,
  upsertScheduleParticipant,
  deleteScheduleParticipant,
} from "@/src/lib/engines/schedules";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const participants = await getScheduleParticipants(id);
  return NextResponse.json({ participants });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const profileId = user.profile?.id;
  if (!profileId) {
    return NextResponse.json({ message: "프로필 정보가 없습니다." }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    status?: "attending" | "declined" | "tentative";
  };

  const status = body.status ?? "attending";
  if (!["attending", "declined", "tentative"].includes(status)) {
    return NextResponse.json({ message: "유효하지 않은 상태입니다." }, { status: 400 });
  }

  const participant = await upsertScheduleParticipant({
    scheduleId: id,
    profileId,
    status,
  });

  return NextResponse.json({ participant });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  const profileId = user.profile?.id;
  if (!profileId) {
    return NextResponse.json({ message: "프로필 정보가 없습니다." }, { status: 400 });
  }

  await deleteScheduleParticipant({ scheduleId: id, profileId });
  return NextResponse.json({ ok: true });
}
