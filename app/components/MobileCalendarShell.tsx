"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import CalendarGridClient from "./CalendarGridClient";
import LeftPanelBranchMembers from "./LeftPanelBranchMembers";
import RightPanel from "./RightPanel";

type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  dealer_name?: string | null;
  location?: string | null;
  instructor?: string | null;
  target_audience?: string | null;
  manager_name?: string | null;
  is_soft_deleted?: boolean;
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
  todayStr: string;
  mobileMonthLabel: string;
  eventsByDateStr: Record<string, ScheduleItem[]>;
};

export default function MobileCalendarShell({
  cells,
  eventsByDay,
  year,
  month,
  isAdmin,
  todayStr,
  mobileMonthLabel,
  eventsByDateStr,
}: Props) {
  const router = useRouter();
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [selectedDateForDetail, setSelectedDateForDetail] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const schedulesForDetail = useMemo(
    () => (selectedDateForDetail ? eventsByDateStr[selectedDateForDetail] ?? [] : []),
    [eventsByDateStr, selectedDateForDetail],
  );

  const handleDateSelect = (dateISO: string | null) => {
    // 빈 칸 클릭 시 상세 패널 닫기
    if (!dateISO) {
      setDetailOpen(false);
      setSelectedDateForDetail(null);
      return;
    }
    if (detailOpen && selectedDateForDetail === dateISO) {
      setDetailOpen(false);
      setSelectedDateForDetail(null);
      return;
    }
    setSelectedDateForDetail(dateISO);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedDateForDetail(null);
  };

  return (
    <div className="flex lg:hidden h-full flex-col">
      {/* 상단 헤더 */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={() => setMobileLeftOpen(true)}
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center"
          >
            <span className="flex flex-col gap-0.5" aria-hidden>
              <span className="w-4 h-0.5 bg-slate-700 rounded" />
              <span className="w-4 h-0.5 bg-slate-700 rounded" />
              <span className="w-4 h-0.5 bg-slate-700 rounded" />
            </span>
          </button>
          <div className="flex flex-col items-end">
            <p className="text-[11px] text-brand-gray font-medium">Management Portal</p>
            <p className="text-sm font-semibold text-brand-black">GALENDER</p>
          </div>
        </div>
      </header>

      {/* 중앙: 달력 + 상세 패널 */}
      <section className="px-4 flex-1 flex flex-col gap-3 overflow-hidden">
        <div
          className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all duration-200 ${
            detailOpen ? "translate-y-0" : ""
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <p className="text-[11px] text-brand-gray font-medium">{mobileMonthLabel}</p>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-[11px] text-brand-gray font-semibold"
                onClick={handleCloseDetail}
                type="button"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/schedules")}
                className="px-3 py-1.5 rounded-full bg-primary text-[11px] text-white font-semibold"
              >
                일정 추가
              </button>
            </div>
          </div>
          <CalendarGridClient
            cells={cells}
            eventsByDay={eventsByDay}
            year={year}
            month={month}
            isAdmin={isAdmin}
            columns={5}
            selectedDateStr={selectedDateForDetail}
            todayStr={todayStr}
            onDateSelect={handleDateSelect}
            detailDateISO={detailOpen ? selectedDateForDetail : null}
            renderDetailRow={(dateISO) => {
              const list = eventsByDateStr[dateISO] ?? [];
              return (
                <div className="bg-white border-t border-slate-200 px-3 py-2 space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-brand-black">
                      {new Date(dateISO + "T12:00:00").toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      일정
                    </p>
                    <button
                      type="button"
                      onClick={handleCloseDetail}
                      className="text-[11px] text-brand-gray hover:text-brand-black"
                    >
                      닫기
                    </button>
                  </div>
                  {list.length === 0 ? (
                    <p className="text-[11px] text-brand-gray">해당 날짜에는 일정이 없습니다.</p>
                  ) : (
                    <ul className="space-y-1.5 text-[11px]">
                      {list.map((s) => (
                        <li
                          key={s.id}
                          className={`flex flex-col rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 ${
                            s.is_soft_deleted ? "opacity-60" : ""
                          }`}
                        >
                          <span
                            className={`font-semibold ${
                              s.is_soft_deleted ? "text-slate-400 line-through" : "text-brand-black"
                            }`}
                          >
                            {s.title}
                          </span>
                          <span
                            className={`${
                              s.is_soft_deleted ? "text-slate-400 line-through" : "text-brand-gray"
                            }`}
                          >
                            {new Date(s.start_at).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            ~{" "}
                            {new Date(s.end_at).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {s.is_all_day && " (종일)"}
                          </span>
                          {s.description && (
                            <span
                              className={`line-clamp-2 ${
                                s.is_soft_deleted ? "text-slate-400 line-through" : "text-slate-600"
                              }`}
                            >
                              {s.description}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }}
          />
        </div>
      </section>

      {/* 모바일 좌측 오버레이 패널 */}
      {mobileLeftOpen && (
        <div
          className="fixed inset-0 z-40 flex lg:hidden"
          onClick={() => setMobileLeftOpen(false)}
        >
          <div
            className="w-72 max-w-[80%] h-full bg-white border-r border-slate-200 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-black">Branch Members</p>
              <button
                type="button"
                onClick={() => setMobileLeftOpen(false)}
                className="text-xs text-brand-gray hover:text-brand-black"
              >
                닫기
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LeftPanelBranchMembers />
            </div>
          </div>
          <button
            type="button"
            aria-label="닫기"
            className="flex-1 bg-black/40"
          />
        </div>
      )}
    </div>
  );
}

