"use client";

import { useEffect, useState, FormEvent } from "react";
import { CopyCodeButton } from "@/app/components/CopyCodeButton";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type InviteCode = {
  id: string;
  code: string;
  branch_name: string;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
};

export default function InviteCodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/invite-codes");
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? "초대 코드를 불러오지 못했습니다.");
          return;
        }
        setCodes(data.codes ?? []);
      } catch {
        setError("네트워크 오류로 초대 코드를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대 코드 생성에 실패했습니다.");
        return;
      }
      if (data.code) {
        setCodes((prev) => [data.code, ...prev]);
      }
    } catch {
      setError("네트워크 오류로 초대 코드 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <AdminPageHeader
          title="초대 코드 관리"
          description="지점 에이전트 온보딩에 사용할 초대 코드를 생성하고 관리합니다."
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}

        <form onSubmit={handleCreate} className="mb-5">
          <EclipseButton
            type="submit"
            disabled={creating}
            isLoading={creating}
            text={creating ? "생성 중..." : "+ 새 초대 코드 생성"}
            variant="primary"
            size="default"
          />
        </form>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">
              초대 코드 리스트
            </h2>
            <span className="text-[11px] text-brand-gray">
              총 {codes.length}개
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                불러오는 중...
              </div>
            ) : codes.length === 0 ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                아직 생성된 초대 코드가 없습니다. 상단 버튼으로 새 코드를
                생성하세요.
              </div>
            ) : (
              codes.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-black">{c.code}</p>
                    <p className="text-[11px] text-brand-gray">
                      {c.branch_name} ·{" "}
                      {new Date(c.created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[11px] text-brand-gray mt-0.5">
                      사용{" "}
                      <span className="font-semibold text-brand-black">
                        {c.used_count}
                      </span>
                      {c.max_uses ? ` / ${c.max_uses}` : " / 제한 없음"}
                      {c.expires_at && (
                        <> · 만료: {new Date(c.expires_at).toLocaleDateString("ko-KR")}</>
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <CopyCodeButton code={c.code} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

