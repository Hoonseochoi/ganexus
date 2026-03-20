// 푸시 구독 저장 API

import { Pool } from 'pg';
import { cookies } from 'next/headers';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

export async function POST(request: Request) {
  // 인증 확인
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  if (!userId) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // 승인 여부 확인
  const profileRes = await pool.query(
    'SELECT is_approved FROM public.profiles WHERE id = $1',
    [userId]
  );
  if (!profileRes.rows[0]?.is_approved) {
    return Response.json({ error: '승인되지 않은 사용자입니다.' }, { status: 401 });
  }

  const body = await request.json() as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  if (!body.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return Response.json({ error: '구독 정보가 올바르지 않습니다.' }, { status: 400 });
  }

  await pool.query(
    `INSERT INTO public.push_subscriptions (user_id, endpoint, p256dh, auth)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, endpoint) DO NOTHING`,
    [userId, body.endpoint, body.keys.p256dh, body.keys.auth]
  );

  return Response.json({ success: true });
}
