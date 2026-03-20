// 매일 18시(KST) = 09:00 UTC 크론 작업 — 다음날 지점 일정 푸시 알림 발송

import { NextRequest } from "next/server";
import webpush from "web-push";
import { query } from "@/src/lib/engines/db";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? "mailto:admin@galender.app",
  process.env.VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "인증 실패" }, { status: 401 });
  }

  // 내일 날짜 계산 (KST 기준: UTC+9)
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const tomorrow = new Date(kstNow);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD

  /*
   * 내일 일정이 있는 지점의 모든 구독자 조회.
   * - 지점 단위로 묶어서 일정 제목 목록을 포함
   * - admin/manager도 포함 (is_approved 무관)
   * - is_soft_deleted 제외
   */
  const subscriptions = await query<{
    endpoint: string;
    p256dh: string;
    auth: string;
    full_name: string;
    branch_name: string;
    schedule_titles: string;
    schedule_count: string;
  }>(
    `SELECT
       ps.endpoint,
       ps.p256dh,
       ps.auth,
       p.full_name,
       p.branch_name,
       branch_sched.titles  AS schedule_titles,
       branch_sched.cnt     AS schedule_count
     FROM public.push_subscriptions ps
     JOIN public.profiles p ON p.id = ps.user_id
     JOIN (
       SELECT
         branch_name,
         STRING_AGG(title, ', ' ORDER BY start_at) AS titles,
         COUNT(*)::text AS cnt
       FROM public.schedules
       WHERE start_at::date = $1::date
         AND (is_soft_deleted IS NULL OR is_soft_deleted = false)
       GROUP BY branch_name
     ) branch_sched ON branch_sched.branch_name = p.branch_name
     WHERE (p.is_approved = true OR p.role IN ('admin', 'manager'))`,
    [tomorrowStr]
  );

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    const count = parseInt(sub.schedule_count, 10);
    const body =
      count === 1
        ? `내일 일정: ${sub.schedule_titles}`
        : `내일 ${count}개의 일정이 있습니다. ${sub.schedule_titles}`;

    const payload = JSON.stringify({
      title: "GALENDER — 내일 일정 안내",
      body,
      url: "/",
      tag: `daily-${tomorrowStr}`,
    });

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch {
      // 만료된 구독 삭제
      await query("DELETE FROM public.push_subscriptions WHERE endpoint = $1", [sub.endpoint]);
      failed++;
    }
  }

  console.log(`[daily-push] ${tomorrowStr} 기준 발송 완료: ${sent}건 성공, ${failed}건 실패`);

  return Response.json({ success: true, date: tomorrowStr, sent, failed });
}
