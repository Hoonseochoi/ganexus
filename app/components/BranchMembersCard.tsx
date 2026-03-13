"use client";

import { useEffect, useState } from "react";

type Manager = {
  id: string;
  name: string;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
  created_at: string;
};

export default function BranchMembersCard() {
  const [managers, setManagers] = useState<Manager[]>([]);
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
          setError(data.message ?? "매니저 목록을 불러오지 못했습니다.");
          return;
        }
        setManagers(data.managers ?? []);
      } catch {
        setError("네트워크 오류로 매니저 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-w-[85vw] snap-center bg-white border border-slate-200 rounded-xl shadow-sm p-4">
      <h3 className="text-sm font-bold mb-3 text-brand-black">Branch Members</h3>
      {loading ? (
        <p className="text-[11px] text-brand-gray">불러오는 중...</p>
      ) : error ? (
        <p className="text-[11px] text-rose-600">{error}</p>
      ) : managers.length === 0 ? (
        <p className="text-[11px] text-brand-gray">등록된 매니저가 없습니다.</p>
      ) : (
        <div className="space-y-3 text-sm">
          {managers.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-700">
                  {m.name[0] ?? "?"}
                </div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-black">
                  {m.name}
                </p>
                <p className="text-[11px] text-brand-gray">
                  {m.branch_name ?? "지점 미지정"} ·{" "}
                  {m.role === "admin" ? "Admin" : "Manager"}
                </p>
                {m.phone_number && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {m.phone_number}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

