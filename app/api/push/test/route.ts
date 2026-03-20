/**
 * 현재 로그인 유저에게만 테스트 푸시 발송
 * GET /api/push/test
 */
import { NextResponse } from "next/server";
import webpush from "web-push";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { query } from "@/src/lib/engines/db";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? "mailto:admin@galender.app",
  process.env.VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.profile) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  // 현재 유저의 구독 목록 조회
  const subs = await query<{ endpoint: string; p256dh: string; auth: string; created_at: string }>(
    `SELECT endpoint, p256dh, auth, created_at
     FROM public.push_subscriptions
     WHERE user_id = $1`,
    [user.profile.id]
  );

  if (subs.length === 0) {
    return NextResponse.json({
      ok: false,
      message: "DB에 구독 정보 없음 — 앱에서 알림 허용을 눌러주세요.",
      user_id: user.profile.id,
      full_name: user.profile.full_name,
    });
  }

  const results: { endpoint: string; created_at: string; success: boolean; error?: string; statusCode?: number }[] = [];

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({
          title: "GALENDER 테스트 알림",
          body: `${user.profile.full_name}님, 푸시 알림이 정상 작동합니다!`,
          url: "/",
          tag: "push-test",
        })
      );
      results.push({ endpoint: sub.endpoint.slice(0, 60) + "...", created_at: sub.created_at, success: true });
    } catch (err) {
      const statusCode = (err as { statusCode?: number }).statusCode;
      const message = (err as { body?: string }).body ?? String(err);
      results.push({
        endpoint: sub.endpoint.slice(0, 60) + "...",
        created_at: sub.created_at,
        success: false,
        statusCode,
        error: message,
      });
    }
  }

  return NextResponse.json({
    ok: true,
    full_name: user.profile.full_name,
    user_id: user.profile.id,
    subscriptionCount: subs.length,
    vapidPublicKeyPrefix: (process.env.VAPID_PUBLIC_KEY ?? "").slice(0, 20) + "...",
    results,
  });
}
