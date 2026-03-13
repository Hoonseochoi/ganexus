"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingShell from "@/app/components/OnboardingShell";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

const steps = [
  { id: "profile", title: "기본 정보" },
  { id: "invite", title: "초대코드 생성" },
  { id: "done", title: "시작하기" },
];

export default function AdminOnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [fullName, setFullName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isProfileValid = fullName.trim() !== "" && branchName.trim() !== "";

  const handleSaveProfile = async () => {
    if (!isProfileValid) return;
    setError(null);
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          branchName: branchName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "프로필 저장에 실패했습니다.");
        return;
      }
      setCurrentStep(1);
    } catch {
      setError("네트워크 오류로 프로필 저장에 실패했습니다.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleCreateInvite = async () => {
    setError(null);
    setLoadingInvite(true);
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대코드 생성에 실패했습니다.");
        return;
      }
      setInviteCode(data.code ?? null);
    } catch {
      setError("네트워크 오류로 초대코드 생성에 실패했습니다.");
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleSubmit = () => {
    router.push("/");
  };

  const isNextDisabled =
    currentStep === 0
      ? !isProfileValid || loadingProfile
      : currentStep === 1
      ? !inviteCode || loadingInvite
      : false;

  const content = (
    <>
      {currentStep === 0 && (
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-brand-black mb-1">
              Admin 기본 정보 설정
            </h2>
            <p className="text-xs text-brand-gray">
              이름과 지점을 먼저 설정하면 초대코드를 생성할 수 있습니다.
            </p>
          </div>
          {error && (
            <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>이름</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="예: 홍길동"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>지점명</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="예: 강남 1지점"
            />
          </div>
          <div className="pt-2">
            <EclipseButton
              type="button"
              variant="primary"
              text={loadingProfile ? "저장 중..." : "정보 저장 후 다음으로"}
              isLoading={loadingProfile}
              disabled={!isProfileValid || loadingProfile}
              className="w-full"
              onClick={handleSaveProfile}
            />
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-brand-black mb-1">
              초대코드 생성
            </h2>
            <p className="text-xs text-brand-gray">
              에이전트가 가입할 수 있는 초대코드를 생성하고 공유하세요.
            </p>
          </div>
          {error && (
            <div className="text-[11px] text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-xs text-brand-gray">
              아래 버튼을 눌러 이 지점에서 사용할 초대코드를 생성합니다.
            </p>
            <EclipseButton
              type="button"
              variant="primary"
              text={loadingInvite ? "생성 중..." : "초대코드 생성"}
              isLoading={loadingInvite}
              className="w-full"
              onClick={handleCreateInvite}
            />
          </div>
          {inviteCode && (
            <div className="mt-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <p className="text-[11px] text-brand-gray mb-1">생성된 초대코드</p>
              <p className="text-sm font-mono font-semibold text-brand-black">
                {inviteCode}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                이 코드를 에이전트에게 전달하면 초대코드 온보딩 화면에서
                사용할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-brand-black mb-1">
              설정이 완료되었습니다
            </h2>
            <p className="text-xs text-brand-gray">
              이름과 지점, 초대코드 설정이 끝났습니다. 이제 메인 캘린더로
              이동해서 일정을 관리할 수 있습니다.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-brand-gray space-y-1">
            <p>
              · 이름:{" "}
              <span className="font-medium text-brand-black">{fullName}</span>
            </p>
            <p>
              · 지점:{" "}
              <span className="font-medium text-brand-black">
                {branchName}
              </span>
            </p>
            {inviteCode && (
              <p>
                · 초대코드:{" "}
                <span className="font-mono font-semibold text-brand-black">
                  {inviteCode}
                </span>
              </p>
            )}
          </div>
          <EclipseButton
            type="button"
            variant="primary"
            text="캘린더로 이동"
            className="w-full"
            onClick={handleSubmit}
          />
        </div>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-background-light px-4 py-6 flex items-center justify-center">
      <OnboardingShell
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onPrev={() => setCurrentStep((s) => Math.max(0, s - 1))}
        onNext={() =>
          setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
        }
        onSubmit={handleSubmit}
        isSubmitting={false}
        isNextDisabled={isNextDisabled}
      >
        {content}
      </OnboardingShell>
    </main>
  );
}

