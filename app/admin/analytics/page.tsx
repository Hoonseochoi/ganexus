import { getCurrentUser } from "@/src/lib/engines/auth";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import AnalyticsDashboard from "./_components/AnalyticsDashboard";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const now = new Date();

  return (
    <div className="min-h-screen bg-background-light p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <AdminPageHeader
          title="통계 대시보드"
          description="월차 현황, 카테고리별 분포, 교육 참석률을 확인할 수 있습니다."
        />
        <AnalyticsDashboard
          initialYear={now.getFullYear()}
          initialMonth={now.getMonth() + 1}
        />
      </div>
    </div>
  );
}
