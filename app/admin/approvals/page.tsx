"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

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
  const [managerCodeByAgent, setManagerCodeByAgent] = useState<Record<string, string>>({});

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
    const managerCode = (managerCodeByAgent[profileId] ?? "").trim();
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          action,
          ...(managerCode !== "" ? { managerCode } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "처리에 실패했습니다.");
        return;
      }
      setAgents((prev) => prev.filter((a) => a.id !== profileId));
      setManagerCodeByAgent((prev) => {
        const next = { ...prev };
        delete next[profileId];
        return next;
      });
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
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="매니저 코드 (매니저로 승인 시)"
                      value={managerCodeByAgent[a.id] ?? ""}
                      onChange={(e) =>
                        setManagerCodeByAgent((prev) => ({
                          ...prev,
                          [a.id]: e.target.value,
                        }))
                      }
                      className="w-full sm:w-44 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex gap-2">
                    <EclipseButton
                      type="button"
                      disabled={actingId !== null}
                      isLoading={actingId === a.id}
                      text={actingId === a.id ? "처리 중..." : "승인"}
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(a.id, "approve")}
                    />
                    <EclipseButton
                      type="button"
                      disabled={actingId !== null}
                      text="거절"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleAction(a.id, "reject")}
                    />
                    </div>
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
