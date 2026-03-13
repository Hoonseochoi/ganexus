import { getCurrentUser } from "@/src/lib/engines/auth";
import { redirect } from "next/navigation";

export default async function PendingApprovalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "manager") {
    redirect("/");
  }

  if (user.profile?.is_approved) {
    redirect("/");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <header className="mb-4">
          <p className="text-xs text-brand-gray mb-1">GALENDER 접근 대기</p>
          <h1 className="text-xl font-semibold text-brand-black">
            지점장 승인 대기 중입니다
          </h1>
        </header>
        <p className="text-sm text-brand-gray mb-3">
          {user?.profile?.full_name
            ? `${user.profile.full_name} 매니저님,`
            : "에이전트님,"}
        </p>
        <p className="text-sm text-brand-gray mb-3">
          현재 지점장님의 승인 절차가 진행 중입니다. 승인 완료 후에는 메인
          캘린더 대시보드에 자동으로 접근 권한이 부여됩니다.
        </p>
        <p className="text-[11px] text-brand-gray">
          승인 상태 문의는 지점장님 또는 지점 사무 담당자에게 직접 확인해 주세요.
        </p>
      </div>
    </main>
  );
}

