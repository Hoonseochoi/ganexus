"use client";

import { useEffect, useState, FormEvent } from "react";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";

type Schedule = {
  id: string;
  title: string;
  description: string | null;
  category: "education" | "vacation" | "hq" | "etc";
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

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState<Schedule["category"]>("etc");
  const [allDay, setAllDay] = useState(false);
  const [description, setDescription] = useState("");

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

    if (!title || !date || (!allDay && (!startTime || !endTime))) {
      setError("제목과 날짜, 시간(또는 종일 여부)을 입력해주세요.");
      return;
    }

    const startAt = allDay
      ? new Date(date + "T00:00:00").toISOString()
      : new Date(`${date}T${startTime}:00`).toISOString();
    const endAt = allDay
      ? new Date(date + "T23:59:59").toISOString()
      : new Date(`${date}T${endTime}:00`).toISOString();

    setSubmitting(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          category,
          startAt,
          endAt,
          isAllDay: allDay,
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
      setEndTime("");
      setAllDay(false);
      setCategory("etc");
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
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-brand-gray">제목</label>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: GA4 교육 / 본사 방문 / 팀 회의"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">날짜</label>
              <input
                type="date"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">종일 여부</label>
              <div className="flex items-center gap-2">
                <input
                  id="all-day"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                />
                <label htmlFor="all-day" className="text-xs text-brand-gray">
                  종일 일정
                </label>
              </div>
            </div>
            {!allDay && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">시작 시간</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-brand-gray">종료 시간</label>
                  <input
                    type="time"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <label className="text-xs text-brand-gray">카테고리</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as Schedule["category"])
                }
              >
                <option value="education">교육</option>
                <option value="vacation">휴가</option>
                <option value="hq">본사 일정</option>
                <option value="etc">기타</option>
              </select>
            </div>
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
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-4 py-2.5 transition disabled:opacity-60"
              >
                {submitting ? "등록 중..." : "+ 일정 등록"}
              </button>
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
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="text-[11px] text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg px-2 py-1 flex-shrink-0"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

