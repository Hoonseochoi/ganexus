"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";

type PendingAgent = {
  id: string;
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  created_at: string;
};

export default function AdminApprovalsPage() {
  const [agents, setAgents] = useState<PendingAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending-agents");
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "목록을 불러오지 못했습니다.");
        return;
      }
      setAgents(data.agents ?? []);
    } catch {
      setError("네트워크 오류로 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (profileId: string, action: "approve" | "reject") => {
    setActingId(profileId);
    setError(null);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "처리에 실패했습니다.");
        return;
      }
      setAgents((prev) => prev.filter((a) => a.id !== profileId));
    } catch {
      setError("네트워크 오류로 처리에 실패했습니다.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <AdminPageHeader
          title="에이전트 승인"
          description="초대 코드로 신청한 에이전트를 승인하거나 거절합니다."
          rightSlot={
            <Link
              href="/admin/invite-codes"
              className="text-sm text-primary hover:underline font-medium flex-shrink-0"
            >
              초대 코드 관리
            </Link>
          }
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">
              승인 대기 목록
            </h2>
            <span className="text-[11px] text-brand-gray">
              총 {agents.length}명
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                불러오는 중...
              </div>
            ) : agents.length === 0 ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                현재 승인 대기 중인 에이전트가 없습니다.
              </div>
            ) : (
              agents.map((a) => (
                <div
                  key={a.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-black truncate">
                      {a.full_name ?? "(이름 없음)"}
                    </p>
                    <p className="text-[11px] text-brand-gray mt-0.5">
                      {a.branch_name ?? "-"} · 신청일{" "}
                      {new Date(a.created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {a.phone_number && (
                      <p className="text-[11px] text-brand-gray">
                        연락처 {a.phone_number}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      disabled={actingId !== null}
                      onClick={() => handleAction(a.id, "approve")}
                      className="rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-3 py-1.5 transition disabled:opacity-60"
                    >
                      {actingId === a.id ? "처리 중..." : "승인"}
                    </button>
                    <button
                      type="button"
                      disabled={actingId !== null}
                      onClick={() => handleAction(a.id, "reject")}
                      className="rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium px-3 py-1.5 transition disabled:opacity-60"
                    >
                      거절
                    </button>
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
