// 푸시 구독 해제 API

import { Pool } from 'pg';
import { cookies } from 'next/headers';

const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  if (!userId) {
    return Response.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const { endpoint } = await request.json() as { endpoint: string };

  if (!endpoint) {
    return Response.json({ error: 'endpoint가 필요합니다.' }, { status: 400 });
  }

  await pool.query(
    'DELETE FROM public.push_subscriptions WHERE user_id = $1 AND endpoint = $2',
    [userId, endpoint]
  );

  return Response.json({ success: true });
}
