"use client";

import { FormEvent, useState } from "react";

type Step = 1 | 2 | 3;

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [inviteCode, setInviteCode] = useState("");
  const [branchName, setBranchName] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleValidateCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidating(true);
    try {
      const res = await fetch("/api/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대 코드 확인 중 오류가 발생했습니다.");
        return;
      }
      setBranchName(data.branchName);
      setStep(2);
    } catch {
      setError("네트워크 오류로 초대 코드를 확인할 수 없습니다.");
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agree) {
      setError("개인정보 활용 동의는 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/agent/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inviteCode,
          fullName,
          birthDate,
          phoneNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "신청서 제출 중 오류가 발생했습니다.");
        return;
      }
      setDone(true);
      setStep(3);
    } catch {
      setError("네트워크 오류로 신청서를 제출할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <header className="mb-6">
          <p className="text-xs text-brand-gray mb-1">GA NEXUS 에이전트 온보딩</p>
          <h1 className="text-xl font-semibold text-brand-black">
            지점 캘린더 합류 신청
          </h1>
          <p className="mt-1 text-[11px] text-brand-gray">
            지점장님께 받은 초대 코드를 입력하고, 간단한 정보를 작성하면 승인
            후 메인 캘린더에 접근할 수 있습니다.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleValidateCode} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">초대 코드</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="예: MERITZ_GANGNAM-ABC123"
              />
            </div>
            <button
              type="submit"
              disabled={validating}
              className="mt-2 w-full rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 transition disabled:opacity-60"
            >
              {validating ? "코드 확인 중..." : "코드 확인"}
            </button>
          </form>
        )}

        {step === 2 && branchName && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-[11px] text-brand-gray">
              <p>
                <span className="font-semibold text-brand-black">
                  {branchName}
                </span>{" "}
                지점 초대 코드가 확인되었습니다.
              </p>
              <p>아래 정보를 작성하면 지점장 승인 후 사용이 가능합니다.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">성함</label>
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
              <label className="text-xs text-brand-gray">생년월일 (YYMMDD)</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={6}
                placeholder="예: 950101"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">휴대폰 번호</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(
                    e.target.value
                      .replace(/[^0-9]/g, "")
                      .replace(/(^02|^01[0-9]|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
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
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 transition disabled:opacity-60"
            >
              {submitting ? "신청서 제출 중..." : "신청서 제출"}
            </button>
          </form>
        )}

        {step === 3 && done && (
          <div className="space-y-4 text-sm text-brand-gray">
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700">
              신청이 완료되었습니다. 지점장님의 승인 후 메인 캘린더에 접근할 수
              있습니다.
            </div>
            <p className="text-[11px]">
              승인 결과는 지점에서 별도로 안내드리며, 내부 로그인 페이지에서
              사번(또는 등록된 계정 정보)으로 접속하실 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

