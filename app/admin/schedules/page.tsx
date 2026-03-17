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
      const profileRes = await fetch("/api/auth/profile");
      const profileData = await profileRes.json();

      if (profileRes.ok && profileData.user) {
        setUserProfile(profileData.user.profile);
      }
    } catch {
      setError("프로필 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 하단 “등록된 일정” 리스트는 캘린더 화면에서 확인하도록 하고,
  // 이 페이지에서는 새 일정 등록에만 집중한다.

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
            // 캘린더 페이지(서버 컴포넌트) 새로고침
            router.refresh();
            setTimeout(() => setSuccess(null), 3000);
          }}
        />
      </div>
    </main>
  );
}

