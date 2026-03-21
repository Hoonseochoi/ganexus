import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/engines/auth";
import {
  getMonthlyLeaveStats,
  getCategoryDistribution,
  getEducationAttendance,
} from "@/src/lib/engines/analytics";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "관리자 권한이 필요합니다." }, { status: 403 });
  }

  const branchName = user.profile?.branch_name;
  if (!branchName) {
    return NextResponse.json({ message: "지점 정보가 없습니다." }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(searchParams.get("month") ?? new Date().getMonth() + 1);

  try {
    const [monthlyLeave, categoryDistribution, educationAttendance] = await Promise.all([
      getMonthlyLeaveStats(branchName, year),
      getCategoryDistribution(branchName, year, month),
      getEducationAttendance(branchName, year),
    ]);

    return NextResponse.json({
      monthlyLeave,
      categoryDistribution,
      educationAttendance,
    });
  } catch (err) {
    console.error("[API 오류] 통계 조회 실패:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}
