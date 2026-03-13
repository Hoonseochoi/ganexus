"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | null;
  created_at: string;
};

/** Admin을 맨 위로 정렬한 목록 반환 */
function sortAdminFirst(members: Member[]): Member[] {
  return [...members].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });
}

function statusDotColor(role: Member["role"]) {
  if (role === "admin") return "bg-green-500";
  if (role === "manager") return "bg-yellow-500";
  return "bg-slate-300";
}

function roleLabel(role: Member["role"]) {
  if (role === "admin") return "Admin";
  if (role === "manager") return "Manager";
  return "Agent";
}

export default function LeftPanelBranchMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/managers");
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? "목록을 불러오지 못했습니다.");
          return;
        }
        const list = (data.managers ?? []) as Member[];
        setMembers(sortAdminFirst(list));
        setCanEdit(Boolean(data.canEdit));
        setCurrentUserId(data.currentUserId ?? null);
      } catch {
        setError("네트워크 오류로 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="pt-8 pb-2">
      <div className="px-3 mb-2 flex items-center justify-between">
        <h3 className="text-[10px] uppercase font-bold tracking-wider text-brand-gray">
          Branch Members
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={() => setEditing((prev) => !prev)}
            className="text-[10px] text-primary hover:underline"
          >
            {editing ? "편집 완료" : "멤버 편집"}
          </button>
        )}
      </div>
      <div className="space-y-4 text-sm">
        {loading ? (
          <p className="px-3 text-xs text-brand-gray">불러오는 중...</p>
        ) : error ? (
          <p className="px-3 text-xs text-rose-600">{error}</p>
        ) : members.length === 0 ? (
          <p className="px-3 text-xs text-brand-gray">등록된 멤버가 없습니다.</p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                  {m.name?.[0] ?? "?"}
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${statusDotColor(m.role)}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-brand-black">
                  {m.name}
                </p>
                <p className="text-xs text-brand-gray">
                  {roleLabel(m.role)}
                </p>
              </div>
              {editing && m.role !== "admin" && m.id !== currentUserId && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/admin/managers", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ memberId: m.id }),
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        alert(data.message ?? "멤버 삭제 중 오류가 발생했습니다.");
                        return;
                      }
                      setMembers((prev) => prev.filter((x) => x.id !== m.id));
                    } catch {
                      alert("네트워크 오류로 멤버를 삭제할 수 없습니다.");
                    }
                  }}
                  className="text-[11px] text-rose-500 hover:text-rose-600"
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
