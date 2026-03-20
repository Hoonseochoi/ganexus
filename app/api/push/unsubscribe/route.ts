import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { query } from "@/src/lib/engines/db";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.profile) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { endpoint } = await request.json() as { endpoint: string };

  if (!endpoint) {
    return NextResponse.json({ error: "endpoint가 필요합니다." }, { status: 400 });
  }

  await query(
    "DELETE FROM public.push_subscriptions WHERE user_id = $1 AND endpoint = $2",
    [user.profile.id, endpoint]
  );

  return NextResponse.json({ success: true });
}
