"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

function ManagerLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"login" | "changePassword">("login");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loginIdForChange, setLoginIdForChange] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "로그인 중 오류가 발생했습니다.");
        return;
      }

      if (data.status === "must_change_password") {
        setLoginIdForChange(data.loginId);
        setStep("changePassword");
        return;
      }

      router.push(data.redirectTo ?? "/");
    } catch {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginIdForChange) {
      setError("세션 정보가 유효하지 않습니다. 다시 로그인해주세요.");
      setStep("login");
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
          loginId: loginIdForChange,
          oldPassword: password,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? "비밀번호 변경 중 오류가 발생했습니다.");
        return;
      }

      router.push("/");
    } catch {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const prefilledCode = params.get("code");

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light px-4 py-8">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <header className="mb-6">
          <p className="text-xs text-brand-gray mb-1">GALENDER 내부 전용</p>
          <h1 className="text-xl font-semibold text-brand-black">
            매니저 로그인
          </h1>
          <p className="mt-1 text-[11px] text-brand-gray">
            등록된 매니저 코드(ID / PW)로 로그인할 수 있습니다. 승인이 완료된
            매니저만 접속 가능합니다.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {step === "login" ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-brand-gray">
                  매니저 코드 (ID)
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={prefilledCode ?? "예: MANAGER-XXXX"}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-brand-gray">
                  매니저 코드 (비밀번호)
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="동일한 매니저 코드를 입력하세요"
                />
              </div>
              <EclipseButton
                type="submit"
                disabled={loading}
                isLoading={loading}
                text={loading ? "로그인 중..." : "로그인"}
                variant="primary"
                className="mt-2 w-full"
              />
            </form>
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-brand-gray mb-2">처음이신가요?</p>
              <EclipseButton
                type="button"
                variant="outline"
                text="초대코드로 매니저 가입하기"
                className="w-full text-xs"
                onClick={() => router.push("/apply")}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-700">
              첫 로그인입니다. 안전한 사용을 위해 반드시 새 비밀번호를 설정해주세요.
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">새 비밀번호</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6자 이상 입력"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">새 비밀번호 확인</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="다시 한 번 입력"
              />
            </div>
            <EclipseButton
              type="submit"
              disabled={loading}
              isLoading={loading}
              text={loading ? "변경 중..." : "비밀번호 변경 후 입장"}
              variant="primary"
              className="mt-2 w-full"
            />
          </form>
        )}
      </div>
    </main>
  );
}

export default function ManagerLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background-light px-4 py-8">
          <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse">
            <div className="h-16 bg-slate-100 rounded mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-11 bg-slate-100 rounded mt-2" />
            </div>
          </div>
        </main>
      }
    >
      <ManagerLoginForm />
    </Suspense>
  );
}

