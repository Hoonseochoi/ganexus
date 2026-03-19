"use client";

import { FormEvent, Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import OnboardingShell from "@/app/components/OnboardingShell";

function ApplyPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const [currentStep, setCurrentStep] = useState(codeFromUrl ? 1 : 0);
  const [inviteCode, setInviteCode] = useState(codeFromUrl || "");
  const [branchName, setBranchName] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [managerCode, setManagerCode] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [autoApproved, setAutoApproved] = useState(false);
  const [isUrlDirectAccess, setIsUrlDirectAccess] = useState(!!codeFromUrl);
  const [loginId, setLoginId] = useState<string | null>(null);

  const steps = [
    { id: "code", title: "초대코드 입력" },
    { id: "info", title: "기본 정보" },
    { id: "done", title: "신청 완료" },
  ];

  // URL 파라미터가 있으면 자동으로 Step 0 스킵
  useEffect(() => {
    if (codeFromUrl) {
      setIsUrlDirectAccess(true);
      setCurrentStep(1);
      // 자동으로 코드 검증 시작
      handleValidateCode();
    }
  }, [codeFromUrl]);

  const handleValidateCode = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setValidating(true);
    try {
      const res = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode || codeFromUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대 코드 확인 중 오류가 발생했습니다.");
        return;
      }
      setBranchName(data.branchName);
      setCurrentStep(1);
    } catch {
      setError("네트워크 오류로 초대 코드를 확인할 수 없습니다.");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!managerCode.trim()) {
      setError("매니저 코드를 입력해주세요.");
      return;
    }
    if (!agree) {
      setError("개인정보 활용 동의는 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        code: inviteCode || codeFromUrl,
        fullName,
        birthDate,
        phoneNumber,
        managerCode,
      };

      const res = await fetch("/api/agent/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "신청서 제출 중 오류가 발생했습니다.");
        return;
      }
      setAutoApproved(Boolean(data.autoApproved));
      setLoginId(data.loginId);
      setDone(true);
      setCurrentStep(2);
    } catch {
      setError("네트워크 오류로 신청서를 제출할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const isNextDisabled =
    currentStep === 0
      ? !inviteCode.trim() || validating
      : currentStep === 1
      ? !fullName.trim() ||
        !branchName ||
        !birthDate.trim() ||
        !phoneNumber.trim() ||
        !agree ||
        submitting ||
        !managerCode.trim()
      : false;

  const content = (
    <div className="px-6 pb-6">
      <header className="mb-6 pt-4">
        <p className="text-xs text-brand-gray mb-1">GALENDER 매니저 온보딩</p>
        <h1 className="text-xl font-semibold text-brand-black">
          지점 캘린더 합류 신청
        </h1>
        <p className="mt-1 text-[11px] text-brand-gray">
          지점장님께 받은 초대 코드를 입력하고, 간단한 정보를 작성하면 승인 후
          메인 캘린더에 접근할 수 있습니다.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      {currentStep === 0 && !isUrlDirectAccess && (
        <form onSubmit={handleValidateCode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>초대 코드</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="예: MERITZ_GANGNAM-ABC123"
            />
          </div>
          <EclipseButton
            type="submit"
            disabled={validating || !inviteCode.trim()}
            isLoading={validating}
            text={validating ? "코드 확인 중..." : "코드 확인"}
            variant="primary"
            className="mt-2 w-full"
          />
        </form>
      )}

      {currentStep === 1 && branchName && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-brand-gray">
            <p>
              <span className="font-semibold text-brand-black">
                {branchName}
              </span>{" "}
              지점 초대 코드가 확인되었습니다.
            </p>
            <p>아래 정보를 작성하면 {isUrlDirectAccess ? "즉시 승인됩니다." : "지점장 승인 후 사용이 가능합니다."}</p>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>매니저 코드</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={managerCode}
              onChange={(e) => setManagerCode(e.target.value)}
              placeholder="로그인 ID·PW로 사용됩니다 (예: MGR-0001)"
            />
            <p className="text-[11px] text-brand-gray">
              승인 후 매니저 로그인에서 이 코드로 ID·비밀번호 동일 입력 후 접속합니다.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>성함</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="예: 김민재"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray">소속 지점</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-brand-black"
              value={branchName}
              disabled
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>생년월일 (YYMMDD)</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={birthDate}
              onChange={(e) =>
                setBirthDate(e.target.value.replace(/[^0-9]/g, ""))
              }
              maxLength={6}
              placeholder="예: 950101"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>휴대폰 번호</span>
              <span className="text-[10px] text-red-500 font-medium">
                **필수
              </span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                    .replace(/[^0-9]/g, "")
                    .replace(
                      /(^02|^01[0-9]|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
                      "$1-$2-$3",
                    ),
                )
              }
              placeholder="예: 010-1234-5678"
            />
          </div>
          <div className="flex items-start gap-2">
            <input
              id="agree"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <label htmlFor="agree" className="text-[11px] text-brand-gray">
              [필수] 개인정보 수집 및 지점 일정 공유에 동의합니다.
            </label>
          </div>
          <EclipseButton
            type="submit"
            disabled={submitting || isNextDisabled}
            isLoading={submitting}
            text={submitting ? "신청서 제출 중..." : "신청서 제출"}
            variant="primary"
            className="mt-2 w-full"
          />
        </form>
      )}

      {currentStep === 2 && done && (
        <div className="space-y-4 text-sm text-brand-gray pb-4">
          {autoApproved ? (
            <>
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700">
                {isUrlDirectAccess
                  ? "✓ 매니저 등록이 완료되었습니다. 매니저 코드(ID·PW 동일)로 로그인 후 비밀번호를 변경해주세요."
                  : "PASS: 이름과 코드가 확인되어 즉시 승인되었습니다."}
              </div>
              <p className="text-[11px]">
                {isUrlDirectAccess
                  ? "초기 로그인은 입력한 매니저 코드(ID·PW 동일)로 진행됩니다."
                  : "지금 바로 매니저 로그인 페이지에서 가입 시 입력한 매니저 코드(ID·PW 동일)로 로그인할 수 있습니다."}
              </p>
            </>
          ) : (
            <>
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700">
                신청이 완료되었습니다. 지점장님의 승인 후 메인 캘린더에 접근할 수 있습니다.
              </div>
              <p className="text-[11px]">
                승인 결과는 지점에서 별도로 안내드리며, 내부 로그인 페이지에서 매니저 로그인으로 접속하실 수 있습니다.
              </p>
            </>
          )}
          <EclipseButton
            type="button"
            text={isUrlDirectAccess && autoApproved ? "비밀번호 설정하러 가기" : "매니저 로그인으로 이동"}
            variant="primary"
            className="w-full"
            onClick={() => {
              if (isUrlDirectAccess && autoApproved && loginId) {
                router.push(`/auth/change-password?loginId=${encodeURIComponent(loginId)}&autoApproved=1`);
              } else {
                router.push("/manager-login");
              }
            }}
          />
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background-light px-4 py-8">
      <OnboardingShell
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onPrev={() => setCurrentStep((s) => Math.max(0, s - 1))}
        onNext={() => {
          if (currentStep === 0) {
            void handleValidateCode();
          } else if (currentStep === 1) {
            void handleSubmit();
          } else {
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1));
          }
        }}
        onSubmit={() => setCurrentStep(2)}
        isSubmitting={submitting || validating}
        isNextDisabled={isNextDisabled}
      >
        {content}
      </OnboardingShell>
      <div className="mt-6 text-center">
        <p className="text-[11px] text-brand-gray mb-2">이미 신청했다면?</p>
        <EclipseButton
          type="button"
          variant="outline"
          size="sm"
          text="매니저 로그인"
          onClick={() => router.push("/manager-login")}
        />
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background-light px-4 py-8">
          <p className="text-sm text-brand-gray">신청 페이지를 불러오는 중입니다...</p>
        </main>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}

