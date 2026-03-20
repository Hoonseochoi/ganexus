import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { query } from "@/src/lib/engines/db";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.profile) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 어드민/매니저는 is_approved 무관 허용
  if (!user.profile.is_approved && user.role === "agent") {
    return NextResponse.json({ error: "승인되지 않은 사용자입니다." }, { status: 401 });
  }

  const body = await request.json() as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: "구독 정보가 올바르지 않습니다." }, { status: 400 });
  }

  // UPSERT: 동일 (user_id, endpoint) 조합이면 키 갱신 + 구독 시각 업데이트
  await query(
    `INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, endpoint)
     DO UPDATE SET p256dh = EXCLUDED.p256dh, auth = EXCLUDED.auth, created_at = NOW()`,
    [user.profile.id, body.endpoint, body.keys.p256dh, body.keys.auth as string]
  );

  console.log(`[push/subscribe] 구독 저장 완료: user_id=${user.profile.id}, endpoint=${body.endpoint.slice(0, 60)}...`);
  return NextResponse.json({ success: true });
}
