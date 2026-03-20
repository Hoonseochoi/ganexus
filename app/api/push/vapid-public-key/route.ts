// VAPID 공개키 반환 API — 클라이언트가 구독 시 사용

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return Response.json({ error: 'VAPID 설정 오류' }, { status: 500 });
  }
  return Response.json({ publicKey });
}
