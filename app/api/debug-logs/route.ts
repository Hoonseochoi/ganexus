import { NextRequest, NextResponse } from "next/server";
import { getScheduleEditLogs } from "@/src/lib/engines/schedules";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const scheduleId = req.nextUrl.searchParams.get("scheduleId");
  const branchName = req.nextUrl.searchParams.get("branchName");
  
  if (!scheduleId || !branchName) return NextResponse.json({ error: "missing params" }, { status: 400 });

  try {
    const logs = await getScheduleEditLogs({ scheduleId, branchName });
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
