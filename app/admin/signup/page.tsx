"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

export default function AdminSignupPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [fullName, setFullName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim()) {
      setError("현재 회사를 입력해주세요.");
      return;
    }
    if (!fullName.trim()) {
      setError("성함을 입력해주세요.");
      return;
    }
    if (!branchName.trim()) {
      setError("지점명을 입력해주세요.");
      return;
    }
    if (!employeeCode.trim()) {
      setError("사번 코드를 입력해주세요.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("휴대폰 번호를 입력해주세요.");
      return;
    }
    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!agree) {
      setError("가입 동의에 체크해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/admin-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          fullName: fullName.trim(),
          branchName: branchName.trim(),
          employeeCode: employeeCode.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "회원가입 처리 중 오류가 발생했습니다.");
        return;
      }
      setDone(true);
    } catch {
      setError("네트워크 오류로 가입할 수 없습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    !company.trim() ||
    !fullName.trim() ||
    !branchName.trim() ||
    !employeeCode.trim() ||
    !phoneNumber.trim() ||
    !email.trim() ||
    !agree ||
    submitting;

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-background-light px-4 py-8">
        <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-700 mb-4">
            가입이 완료되었습니다.
          </div>
          <p className="text-[11px] text-brand-gray mb-6">
            관리자 로그인에서 <strong>사번</strong>을 ID와 비밀번호에 동일하게
            입력한 뒤, 첫 로그인 시 비밀번호 변경 후 대시보드에 입장할 수 있습니다.
          </p>
          <EclipseButton
            type="button"
            text="관리자 로그인으로 이동"
            variant="primary"
            className="w-full"
            onClick={() => router.push("/login")}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background-light px-4 py-8">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <header className="mb-6">
          <p className="text-xs text-brand-gray mb-1">GA NEXUS 관리자</p>
          <h1 className="text-xl font-semibold text-brand-black">
            관리자 회원가입
          </h1>
          <p className="mt-1 text-[11px] text-brand-gray">
            아래 정보를 입력하면 관리자 계정이 생성됩니다. 최초 로그인 시 사번(ID·PW 동일)으로
            로그인한 뒤 비밀번호 변경이 필요합니다.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>현재 회사</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="예: 메리츠종합금융서비스"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>성함</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="예: 김민재"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>지점명</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="예: 강남지점"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>사번 코드 (ID / PW)</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="로그인 ID·PW로 사용됩니다 (예: 121202739)"
            />
            <p className="text-[11px] text-brand-gray">
              최초 로그인 시 ID와 비밀번호에 동일한 사번을 입력하세요.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>휴대폰 번호</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
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
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray flex items-center gap-1">
              <span>이메일</span>
              <span className="text-[10px] text-red-500 font-medium">*</span>
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="예: admin@company.com"
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
              [필수] 개인정보 수집 및 이용·관리자 서비스 이용에 동의합니다.
            </label>
          </div>
          <EclipseButton
            type="submit"
            disabled={isDisabled}
            isLoading={submitting}
            text={submitting ? "가입 처리 중..." : "가입하기"}
            variant="primary"
            className="mt-2 w-full"
          />
        </form>
      </div>
      <div className="mt-6 text-center">
        <p className="text-[11px] text-brand-gray mb-2">이미 계정이 있으신가요?</p>
        <Link href="/login">
          <EclipseButton type="button" variant="outline" size="sm" text="관리자 로그인" />
        </Link>
      </div>
    </main>
  );
}
