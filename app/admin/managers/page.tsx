"use client";

import { useState, FormEvent } from "react";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import Link from "next/link";

export default function AdminManagersPage() {
  const [managerCode, setManagerCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const code = managerCode.trim();
    const name = fullName.trim();
    const branch = branchName.trim();
    if (!code || !name || !branch) {
      setError("매니저 코드, 이름, 지점명을 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/managers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerCode: code,
          fullName: name,
          branchName: branch,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "등록에 실패했습니다.");
        return;
      }
      setSuccess(data.message ?? "매니저가 등록되었습니다.");
      setManagerCode("");
      setFullName("");
      setBranchName("");
    } catch {
      setError("네트워크 오류로 등록할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-xl mx-auto">
        <AdminPageHeader
          title="매니저 등록"
          description="새 매니저를 등록합니다. 매니저코드로 로그인(ID/PW 동일)할 수 있습니다."
          rightSlot={
            <Link
              href="/admin/approvals"
              className="text-sm text-primary hover:underline font-medium flex-shrink-0"
            >
              에이전트 승인
            </Link>
          }
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700">
            {success}
          </div>
        )}

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-brand-black mb-4">
            매니저 추가
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">
                매니저 코드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={managerCode}
                onChange={(e) => setManagerCode(e.target.value)}
                placeholder="예: MANAGER-01"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <p className="text-[11px] text-brand-gray">
                로그인 시 ID·비밀번호 모두 이 코드를 사용합니다.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">
                지점명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="예: 메리츠 강남지점"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>
            <EclipseButton
              type="submit"
              disabled={loading}
              isLoading={loading}
              text={loading ? "등록 중..." : "매니저 등록"}
              variant="primary"
              className="w-full"
            />
          </form>
        </section>
      </div>
    </main>
  );
}
