// 매일 18시(KST) 크론 작업 — 다음날 일정 푸시 알림 발송

import { Pool } from 'pg';
import webpush from 'web-push';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? 'mailto:admin@galender.app',
  process.env.VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? ''
);

export async function POST(request: Request) {
  // 크론 시크릿 검증
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: '인증 실패' }, { status: 401 });
  }

  // 내일 날짜 계산 (KST 기준)
  const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const tomorrow = new Date(kstNow);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // YYYY-MM-DD

  // 내일 일정이 있는 사용자의 구독 정보 조회
  const { rows: subscriptions } = await pool.query<{
    endpoint: string;
    p256dh: string;
    auth: string;
    full_name: string;
    schedule_titles: string;
  }>(
    `SELECT
       ps.endpoint,
       ps.p256dh,
       ps.auth,
       p.full_name,
       STRING_AGG(s.title, ', ') AS schedule_titles
     FROM public.push_subscriptions ps
     JOIN public.profiles p ON p.id = ps.user_id
     JOIN public.schedules s ON s.user_id = ps.user_id
     WHERE s.start_date::date = $1::date
       AND p.is_approved = true
     GROUP BY ps.endpoint, ps.p256dh, ps.auth, p.full_name`,
    [tomorrowStr]
  );

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    const payload = JSON.stringify({
      title: 'GALENDER — 내일 일정',
      body: `${sub.full_name}님, 내일 일정: ${sub.schedule_titles}`,
      url: '/',
      tag: `daily-${tomorrowStr}`,
    });

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch {
      // 만료된 구독은 DB에서 삭제
      await pool.query(
        'DELETE FROM public.push_subscriptions WHERE endpoint = $1',
        [sub.endpoint]
      );
      failed++;
    }
  }

  return Response.json({
    success: true,
    date: tomorrowStr,
    sent,
    failed,
  });
}
