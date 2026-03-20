// 어드민 수동 푸시 발송 API

import { Pool } from 'pg';
import webpush from 'web-push';
import { cookies } from 'next/headers';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? 'mailto:admin@galender.app',
  process.env.VAPID_PUBLIC_KEY ?? '',
  process.env.VAPID_PRIVATE_KEY ?? ''
);

export async function POST(request: Request) {
  // 어드민 권한 확인
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  if (!userId) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const profileRes = await pool.query(
    "SELECT role, branch_name FROM public.profiles WHERE id = $1",
    [userId]
  );
  const profile = profileRes.rows[0];
  if (!profile || profile.role !== 'admin') {
    return Response.json({ error: '관리자만 접근할 수 있습니다.' }, { status: 403 });
  }

  const { title, body, url = '/' } = await request.json() as {
    title: string;
    body: string;
    url?: string;
  };

  if (!title || !body) {
    return Response.json({ error: '제목과 내용을 입력해주세요.' }, { status: 400 });
  }

  // 같은 지점 사용자 구독 조회
  const { rows: subscriptions } = await pool.query<{
    endpoint: string;
    p256dh: string;
    auth: string;
  }>(
    `SELECT ps.endpoint, ps.p256dh, ps.auth
     FROM public.push_subscriptions ps
     JOIN public.profiles p ON p.id = ps.user_id
     WHERE p.branch_name = $1 AND p.is_approved = true`,
    [profile.branch_name]
  );

  const payload = JSON.stringify({ title, body, url, tag: `admin-${Date.now()}` });

  let sent = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch {
      await pool.query(
        'DELETE FROM public.push_subscriptions WHERE endpoint = $1',
        [sub.endpoint]
      );
      failed++;
    }
  }

  return Response.json({ success: true, sent, failed });
}
