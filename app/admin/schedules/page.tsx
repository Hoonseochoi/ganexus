"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { ScheduleAddScheduler } from "./_components/ScheduleAddScheduler";

type Schedule = {
  id: string;
  title: string;
  description: string | null;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  created_at: string;
};

export default function AdminSchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const [userProfile, setUserProfile] = useState<{ full_name: string | null } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedulesRes, profileRes] = await Promise.all([
        fetch("/api/schedules"),
        fetch("/api/auth/profile")
      ]);
      
      const schedulesData = await schedulesRes.json();
      const profileData = await profileRes.json();

      if (!schedulesRes.ok) {
        setError(schedulesData.message ?? "일정을 불러오지 못했습니다.");
      } else {
        setSchedules(schedulesData.schedules ?? []);
      }

      if (profileRes.ok && profileData.user) {
        setUserProfile(profileData.user.profile);
      }
    } catch {
      setError("네트워크 오류로 일정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("해당 일정을 삭제하시겠습니까?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "일정 삭제에 실패했습니다.");
        return;
      }
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      // 캘린더 페이지(서버 컴포넌트)도 즉시 새로고침
      router.refresh();
    } catch {
      setError("네트워크 오류로 일정 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <AdminPageHeader
          title="일정 관리"
          description="지점별 주요 일정(교육, 휴가, 본사 일정 등)을 등록하고 관리합니다."
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800">
            {success}
          </div>
        )}

        {/* 새 일정 등록 - 3단 스케줄러 */}
        <ScheduleAddScheduler 
          userFullName={userProfile?.full_name ?? "관리자"} 
          onSuccess={() => {
            setSuccess("일정이 등록되었습니다.");
            load();
            router.refresh();
            setTimeout(() => setSuccess(null), 3000);
          }}
        />


        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">
              등록된 일정
            </h2>
            <span className="text-[11px] text-brand-gray">
              총 {schedules.length}건
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                불러오는 중...
              </div>
            ) : schedules.length === 0 ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                아직 등록된 일정이 없습니다.
              </div>
            ) : (
              schedules.map((s) => (
                <div
                  key={s.id}
                  className="px-4 py-3 flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-black truncate">
                      {s.title}
                    </p>
                    <p className="text-[11px] text-brand-gray mt-0.5">
                      {new Date(s.start_at).toLocaleString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      ~{" "}
                      {new Date(s.end_at).toLocaleString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {s.is_all_day && " (종일)"}
                    </p>
                    {s.description && (
                      <p className="text-[11px] text-brand-gray mt-0.5 line-clamp-2">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <EclipseButton
                    type="button"
                    text="삭제"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
                    className="flex-shrink-0"
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

