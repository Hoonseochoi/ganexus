import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "인증되지 않은 사용자입니다." }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
