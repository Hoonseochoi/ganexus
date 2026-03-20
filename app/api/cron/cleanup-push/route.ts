import { NextRequest, NextResponse } from "next/server";
import { query } from "@/src/lib/engines/db";

/**
 * 매주 월요일 02:00 UTC (11:00 KST) 실행
 * endpoint 오류로 실패 처리된 구독(dead subscriptions)이 daily-push에서 삭제되지 않은 경우를 대비해
 * 30일 이상 된 구독 레코드를 정리합니다.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "인증 실패" }, { status: 401 });
  }

  try {
    const result = await query<{ id: string }>(
      `DELETE FROM public.push_subscriptions
       WHERE created_at < NOW() - INTERVAL '30 days'
       RETURNING id`,
      []
    );

    const deletedCount = result.length;
    console.log(`[cleanup-push] 만료 구독 ${deletedCount}건 삭제 완료`);

    return NextResponse.json({ ok: true, deleted: deletedCount });
  } catch (err) {
    console.error("[cleanup-push] 정리 실패:", err);
    return NextResponse.json({ message: "정리 중 오류 발생" }, { status: 500 });
  }
}
