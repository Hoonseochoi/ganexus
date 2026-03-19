"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import OnboardingShell from "@/app/components/OnboardingShell";

function ChangePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginId = searchParams.get("loginId") || "";
  const isAutoApproved = searchParams.get("autoApproved") === "1";

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !newPasswordConfirm) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 6) {
      setError("새 비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loginId,
          oldPassword: isAutoApproved ? loginId : oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "비밀번호 변경 중 오류가 발생했습니다.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/manager-login");
      }, 2000);
    } catch {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [{ id: "password", title: "비밀번호 설정" }];

  const content = (
    <div className="px-6 pb-6">
      <header className="mb-6 pt-4">
        <p className="text-xs text-brand-gray mb-1">GALENDER 매니저 온보딩</p>
        <h1 className="text-xl font-semibold text-brand-black">
          비밀번호 설정
        </h1>
        <p className="mt-1 text-[11px] text-brand-gray">
          {isAutoApproved
            ? "매니저 등록이 완료되었습니다. 로그인에 사용할 비밀번호를 설정해주세요."
            : "승인이 완료되었습니다. 새로운 비밀번호를 설정해주세요."}
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700">
          비밀번호가 설정되었습니다. 로그인 페이지로 이동 중입니다...
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        {!isAutoApproved && (
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>현재 비밀번호</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="현재 비밀번호"
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-brand-gray flex items-center gap-1">
            <span>새 비밀번호</span>
            <span className="text-[10px] text-red-500 font-medium">
              **필수
            </span>
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 (6자 이상)"
            disabled={loading || success}
          />
          <p className="text-[11px] text-brand-gray">6자 이상으로 설정해주세요.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-brand-gray flex items-center gap-1">
            <span>새 비밀번호 확인</span>
            <span className="text-[10px] text-red-500 font-medium">
              **필수
            </span>
          </label>
          <input
            type="password"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            placeholder="새 비밀번호 재입력"
            disabled={loading || success}
          />
        </div>

        <EclipseButton
          type="submit"
          disabled={loading || success || !newPassword || !newPasswordConfirm}
          isLoading={loading}
          text={loading ? "설정 중..." : "비밀번호 설정"}
          variant="primary"
          className="w-full mt-2"
        />

        <EclipseButton
          type="button"
          variant="outline"
          text="로그인 페이지로 돌아가기"
          className="w-full"
          onClick={() => router.push("/manager-login")}
          disabled={loading || success}
        />
      </form>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background-light px-4 py-8">
      <OnboardingShell
        steps={steps}
        currentStep={0}
        onStepChange={() => {}}
        onPrev={() => router.push("/manager-login")}
        onNext={() => {}}
        onSubmit={() => {}}
        isSubmitting={loading}
        isNextDisabled={loading || success}
      >
        {content}
      </OnboardingShell>
    </main>
  );
}

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background-light">
          <p className="text-sm text-brand-gray">불러오는 중...</p>
        </main>
      }
    >
      <ChangePasswordContent />
    </Suspense>
  );
}
