"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

export default function AdminBranchPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/admin/profile");
        if (!res.ok) return;
        const data = await res.json();
        if (data.profile) {
          setFullName(data.profile.full_name ?? "");
          setBranchName(data.profile.branch_name ?? "");
        }
      } catch {
        // 무시: 초기 로딩 실패는 필수 아님
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, branchName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "저장 중 오류가 발생했습니다.");
        return;
      }
      router.push("/");
    } catch {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="w-full max-w-md mx-auto px-6 py-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <AdminPageHeader
          title="지점 정보 설정"
          description="처음 한 번만 설정하면, 이후에는 바로 메인 캘린더로 진입합니다."
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray">관리자 이름</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="예: 홍길동"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-brand-gray">지점명</label>
            <input
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="예: 메리츠 강남지점"
            />
          </div>
          <EclipseButton
            type="submit"
            disabled={loading}
            isLoading={loading}
            text={loading ? "저장 중..." : "저장하고 메인으로 이동"}
            variant="primary"
            className="mt-2 w-full"
          />
        </form>
      </div>
    </main>
  );
}

