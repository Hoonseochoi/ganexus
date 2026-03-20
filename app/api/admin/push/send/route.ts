import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { getCurrentUser } from "@/src/lib/engines/auth";
import { query } from "@/src/lib/engines/db";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL ?? "mailto:admin@galender.app",
  process.env.VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !user.profile) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "관리자만 접근할 수 있습니다." }, { status: 403 });
  }

  const { title, body, url = "/" } = await request.json() as {
    title: string;
    body: string;
    url?: string;
  };

  if (!title || !body) {
    return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 });
  }

  // 같은 지점의 모든 구독자 조회 (admin 포함)
  const subscriptions = await query<{ endpoint: string; p256dh: string; auth: string; full_name: string | null }>(
    `SELECT ps.endpoint, ps.p256dh, ps.auth, p.full_name
     FROM public.push_subscriptions ps
     JOIN public.profiles p ON p.id = ps.user_id
     WHERE p.branch_name = $1
       AND (p.is_approved = true OR p.role IN ('admin', 'manager'))`,
    [user.profile.branch_name]
  );

  const payload = JSON.stringify({ title, body, url, tag: `admin-${Date.now()}` });

  let sent = 0;
  let failed = 0;
  const sentLogs: string[] = [];
  const failedLogs: string[] = [];

  for (const sub of subscriptions) {
    const name = sub.full_name ?? "알 수 없음";
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
      sentLogs.push(name);
    } catch {
      await query("DELETE FROM public.push_subscriptions WHERE endpoint = $1", [sub.endpoint]);
      failed++;
      failedLogs.push(name);
    }
  }

  return NextResponse.json({ success: true, sent, failed, sentLogs, failedLogs });
}
