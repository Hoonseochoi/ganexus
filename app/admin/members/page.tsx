"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type Member = {
  id: string;
  name: string;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
  created_at: string;
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/managers");
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "브랜치 멤버 목록을 불러오지 못했습니다.");
        return;
      }
      setMembers((data.managers ?? []) as Member[]);
    } catch {
      setError("네트워크 오류로 브랜치 멤버 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (memberId: string) => {
    setDeletingId(memberId);
    setError(null);
    try {
      const res = await fetch("/api/admin/managers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "멤버 삭제에 실패했습니다.");
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setConfirmingId(null);
    } catch {
      setError("네트워크 오류로 멤버를 삭제할 수 없습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <AdminPageHeader
          title="브랜치 멤버 관리"
          description="지점에 속한 매니저/에이전트 멤버를 한눈에 보고 관리할 수 있습니다."
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">브랜치 멤버</h2>
            <span className="text-[11px] text-brand-gray">총 {members.length}명</span>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-xs text-brand-gray">불러오는 중...</div>
          ) : members.length === 0 ? (
            <div className="px-4 py-6 text-xs text-brand-gray">
              현재 등록된 브랜치 멤버가 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {members.map((m) => {
                const isConfirming = confirmingId === m.id;
                const isDeleting = deletingId === m.id;
                const isAdmin = m.role === "admin";

                return (
                  <li
                    key={m.id}
                    className="px-4 py-3 flex items-center gap-3 text-sm hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                        {m.name?.[0] ?? "?"}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-brand-black">
                        {m.name}
                      </p>
                      <p className="text-[11px] text-brand-gray truncate">
                        {m.branch_name ?? "지점 미지정"} · {m.role === "admin" ? "Admin" : m.role === "manager" ? "Manager" : "Agent"}
                      </p>
                      {m.phone_number && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {m.phone_number}
                        </p>
                      )}
                    </div>
                    {/* 관리 탭: 이름 오른쪽 빨간 쓰레기통 + 확인 플로우 */}
                    {!isAdmin && (
                      <div className="flex items-center gap-2">
                        {isConfirming ? (
                          <>
                            <span className="text-[11px] text-brand-gray hidden sm:inline">
                              삭제 하시겠습니까?
                            </span>
                            <EclipseButton
                              type="button"
                              size="sm"
                              variant="destructive"
                              text={isDeleting ? "삭제 중..." : "삭제"}
                              disabled={isDeleting}
                              onClick={() => handleDelete(m.id)}
                              className="!text-[11px]"
                            />
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="text-[11px] text-brand-gray hover:text-brand-black ml-1"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmingId(m.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors"
                            aria-label="멤버 삭제"
                          >
                            <span className="text-rose-500 text-lg" aria-hidden>
                              🗑
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

