"use client";

import { useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import CalendarCellDropZone from "./CalendarCellDropZone";
import DraggableSchedulePill from "./DraggableSchedulePill";
import { useRightPanel } from "./RightPanelCollapseWrapper";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: string;
};

type CellData = {
  key: number;
  day: number | null;
  dateISO: string | null;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isHoliday: boolean;
};

type Props = {
  cells: CellData[];
  eventsByDay: Record<string, ScheduleItem[]>;
  year: number;
  month: number;
  isAdmin: boolean;
  columns: 5 | 7;
  selectedDateStr: string | null;
  todayStr: string;
};

export default function CalendarGridClient({
  cells,
  eventsByDay,
  year,
  month,
  isAdmin,
  columns,
  selectedDateStr,
  todayStr,
}: Props) {
  const router = useRouter();
  const rightPanel = useRightPanel();
  const [quickDateISO, setQuickDateISO] = useState<string | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickContent, setQuickContent] = useState("");
  const [quickSaving, setQuickSaving] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleCellClick = (dateISO: string | null) => {
    if (!dateISO) return;
    const params = new URLSearchParams();
    params.set("year", String(year));
    params.set("month", String(month + 1));
    params.set("date", dateISO);
    router.push(`/?${params.toString()}`);
    rightPanel?.setOpen(true);
  };

  const weekdays = columns === 5 ? ["월", "화", "수", "목", "금"] : ["일", "월", "화", "수", "목", "금", "토"];

  const handleQuickSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!quickDateISO || !quickTitle.trim() || quickSaving) return;
      setQuickError(null);
      setQuickSaving(true);
      try {
        const [y, m, d] = quickDateISO.split("-").map(Number);
        const localStart = new Date(y, m - 1, d, 0, 0, 0, 0);
        const localEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
        const res = await fetch("/api/schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: quickTitle.trim(),
            description: quickContent.trim() || null,
            startAt: localStart.toISOString(),
            endAt: localEnd.toISOString(),
            isAllDay: true,
            category: "etc",
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setQuickError(data.message ?? "일정 추가에 실패했습니다.");
          return;
        }
        setQuickDateISO(null);
        setQuickTitle("");
        setQuickContent("");
        router.refresh();
      } catch {
        setQuickError("네트워크 오류가 발생했습니다.");
      } finally {
        setQuickSaving(false);
      }
    },
    [quickDateISO, quickTitle, quickContent, quickSaving, router],
  );

  const closeQuick = useCallback(() => {
    if (!quickSaving) {
      setQuickDateISO(null);
      setQuickTitle("");
      setQuickContent("");
      setQuickError(null);
    }
  }, [quickSaving]);

  return (
    <>
      <div className={`grid ${columns === 5 ? "grid-cols-5" : "grid-cols-7"} bg-slate-50 border-b border-slate-200 font-calendar`}>
        {weekdays.map((d) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-bold uppercase text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>
      <div className={`grid ${columns === 5 ? "grid-cols-5" : "grid-cols-7"} flex-1`}>
        {cells.map((cell) => {
          const events = cell.day !== null ? (eventsByDay[String(cell.day)] ?? []) : [];
          let dayColor = "text-slate-800";
          let dayWeight = "font-normal";
          if (cell.isToday) {
            dayColor = "text-brand-black";
            dayWeight = "font-bold";
          } else if (cell.isSunday || cell.isHoliday) {
            dayColor = "text-red-500";
          } else if (cell.isSaturday) {
            dayColor = "text-blue-500";
          }

          const isSelected = cell.dateISO === selectedDateStr;
          const isTodayHighlight =
            cell.isToday && (!selectedDateStr || selectedDateStr === todayStr);
          const isHighlight = isSelected || isTodayHighlight;
          const borderClass = isHighlight
            ? "border-2 border-primary bg-primary/5 relative"
            : "border border-slate-100";

          return (
            <CalendarCellDropZone
              key={cell.key}
              dateISO={cell.dateISO}
              isEmpty={cell.day === null}
              className={`p-2 min-h-[70px] lg:min-h-[120px] cursor-pointer ${borderClass}`}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleCellClick(cell.dateISO)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCellClick(cell.dateISO);
                }}
                className="w-full h-full text-left flex flex-col"
              >
                <div className="flex-1 min-h-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-calendar text-sm ${dayWeight} ${dayColor}`}>
                      {cell.day ?? ""}
                    </span>
                    {cell.isToday && (
                      <span
                        className="today-badge-float inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide bg-primary/15 text-primary border border-primary/30"
                        aria-label="오늘"
                      >
                        TODAY
                      </span>
                    )}
                  </div>
                {cell.day !== null && events.length > 0 && (
                  <div className="mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                    {events.slice(0, 3).map((ev) => (
                      <DraggableSchedulePill
                        key={ev.id}
                        schedule={{
                          id: ev.id,
                          title: ev.title,
                          start_at: ev.start_at,
                          end_at: ev.end_at,
                          is_all_day: ev.is_all_day,
                          category: ev.category,
                        }}
                        isAdmin={isAdmin}
                        onPillClick={() => handleCellClick(cell.dateISO)}
                      />
                    ))}
                    {events.length > 3 && (
                      <div className="text-[9px] text-brand-gray">
                        + {events.length - 3}개 더보기
                      </div>
                    )}
                  </div>
                )}
                </div>
                {cell.day !== null && isHighlight && (
                  <div className="mt-auto pt-1 flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <EclipseButton
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickDateISO(cell.dateISO);
                        setQuickTitle("");
                        setQuickContent("");
                        setQuickError(null);
                      }}
                      aria-label="퀵일정 추가"
                      className="!h-7 !w-7 !min-w-0 !p-0"
                    >
                      +
                    </EclipseButton>
                  </div>
                )}
              </div>
            </CalendarCellDropZone>
          );
        })}
      </div>

      {quickDateISO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeQuick}>
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-brand-black mb-4">퀵일정</h3>
            {quickError && (
              <p className="mb-3 text-xs text-rose-600">{quickError}</p>
            )}
            <form onSubmit={handleQuickSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">일정</label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="제목"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">내용</label>
                <textarea
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  placeholder="내용 (선택)"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <EclipseButton
                  type="button"
                  variant="outline"
                  size="sm"
                  text="취소"
                  onClick={closeQuick}
                  disabled={quickSaving}
                  className="flex-1"
                />
                <EclipseButton
                  type="submit"
                  disabled={quickSaving || !quickTitle.trim()}
                  isLoading={quickSaving}
                  text={quickSaving ? "저장 중..." : "추가"}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
