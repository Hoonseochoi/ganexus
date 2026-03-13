"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
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
      <h3 className="px-3 text-[10px] uppercase font-bold tracking-wider text-brand-gray mb-4">
        Branch Members
      </h3>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
