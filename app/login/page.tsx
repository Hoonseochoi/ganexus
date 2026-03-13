"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

export default function LoginPage() {
  const router = useRouter();
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

      router.push(data.redirectTo ?? "/");
    } catch {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light px-4 py-8">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <header className="mb-6">
          <p className="text-xs text-brand-gray mb-1">GA NEXUS 내부 전용</p>
          <h1 className="text-xl font-semibold text-brand-black">
            지점 관리자 로그인
          </h1>
          <p className="mt-1 text-[11px] text-brand-gray">
            지점 캘린더와 온보딩을 관리하는 관리자 계정으로 로그인하세요.
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        )}

        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">사번(ID)</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="예: 121202739"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">비밀번호</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="초기: 사번과 동일"
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
            <p className="mt-2 text-[11px] text-brand-gray">
              최초 로그인 시, 보안을 위해 비밀번호 변경 단계가 자동으로 진행됩니다.
            </p>
          </form>
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

