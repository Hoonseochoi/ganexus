"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES: { value: Schedule["category"]; label: string }[] = [
    { value: "dealer", label: "대리점일정" },
    { value: "internal", label: "사내일정" },
    { value: "personal", label: "개인" },
    { value: "leave", label: "월차" },
    { value: "etc", label: "기타" },
  ];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(""); // 대리점 '교육 시작 시간'용
  const [category, setCategory] = useState<Schedule["category"]>("dealer");
  const [description, setDescription] = useState("");
  const [dealerName, setDealerName] = useState("");
  const [location, setLocation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [managerName, setManagerName] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/schedules");
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "일정을 불러오지 못했습니다.");
        return;
      }
      setSchedules(data.schedules ?? []);
    } catch {
      setError("네트워크 오류로 일정을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    let startAt: string | undefined;
    if (date) {
      if (startTime) {
        startAt = new Date(`${date}T${startTime}:00`).toISOString();
      } else {
        startAt = new Date(date + "T00:00:00").toISOString();
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description || null,
          category,
          startAt,
          dealerName: dealerName || null,
          location: location || null,
          instructor: instructor || null,
          targetAudience: targetAudience || null,
          managerName: managerName || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "일정 생성에 실패했습니다.");
        return;
      }
      if (data.schedule) {
        setSchedules((prev) => [data.schedule, ...prev]);
      }
      setSuccess("일정이 등록되었습니다. 메인 캘린더에서 확인할 수 있습니다.");
      setTimeout(() => setSuccess(null), 3000);
      setTitle("");
      setDescription("");
      setDate("");
      setStartTime("");
      setCategory("dealer");
      setDealerName("");
      setLocation("");
      setInstructor("");
      setTargetAudience("");
      setManagerName("");
    } catch {
      setError("네트워크 오류로 일정 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

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
    } catch {
      setError("네트워크 오류로 일정 삭제에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-4xl mx-auto">
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

        <section className="mb-6 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <h2 className="text-sm font-semibold text-brand-black mb-3">
            새 일정 등록
          </h2>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
          >
            <div className="md:col-span-2">
              <span className="text-xs text-brand-gray block mb-2">카테고리</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <label
                    key={c.value}
                    className="inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={c.value}
                      checked={category === c.value}
                      onChange={() => setCategory(c.value)}
                      className="sr-only"
                    />
                    <span
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        category === c.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 bg-white text-brand-gray hover:border-slate-300"
                      }`}
                    >
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-brand-gray flex items-center gap-1">
                <span>
                  {category === "dealer"
                    ? "대리점명"
                    : category === "leave"
                    ? "매니저명"
                    : "제목"}
                </span>
                <span className="text-[10px] text-red-500 font-medium">**필수</span>
              </label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  category === "dealer"
                    ? "예: GA 대리점"
                    : "예: GA4 교육 / 본사 방문 / 팀 회의"
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray flex items-center gap-1">
                <span>날짜</span>
                <span className="text-[10px] text-red-500 font-medium">**필수</span>
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            {/* 카테고리별 추가 필드 */}
            {category === "dealer" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">교육 시작 시간 (텍스트)</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="예: 14:00"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">장소</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: 본사 교육장"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">교육자</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="예: 홍길동 매니저"
                  />
                </div>
              </>
            )}
            {category === "internal" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">대상자</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="예: 영업팀 전체"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">장소</label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="예: 회의실 A"
                  />
                </div>
              </>
            )}
            {category === "personal" && (
              <div className="space-y-1.5">
                <label className="text-xs text-brand-gray">장소 (선택)</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 외근 위치 등"
                />
              </div>
            )}
            {category === "leave" && null}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-brand-gray">메모 (선택)</label>
              <textarea
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60 min-h-[60px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상세 메모를 입력하세요."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <EclipseButton
                type="submit"
                disabled={submitting}
                isLoading={submitting}
                text={submitting ? "등록 중..." : "+ 일정 등록"}
                variant="primary"
              />
            </div>
          </form>
        </section>

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

