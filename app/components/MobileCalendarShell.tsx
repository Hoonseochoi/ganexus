"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CalendarGridClient from "./CalendarGridClient";
import LeftPanelBranchMembers from "./LeftPanelBranchMembers";
import { ScheduleDetailPopup, type ScheduleItem } from "./RightPanel";
import AdminSettingsMenu from "./AdminSettingsMenu";

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
  userFullName?: string | null;
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
  userFullName,
}: Props) {
  const router = useRouter();
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [selectedDateForDetail, setSelectedDateForDetail] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);

  const goToPrevMonth = () => {
    const d = new Date(year, month - 1, 1);
    router.push(`/?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  };
  const goToNextMonth = () => {
    const d = new Date(year, month + 1, 1);
    router.push(`/?year=${d.getFullYear()}&month=${d.getMonth() + 1}`);
  };

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
            {/* 연월 + 화살표 네비게이션 */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="이전 달"
                onClick={goToPrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-brand-gray"
              >
                &#8249;
              </button>
              <p className="text-sm font-semibold text-brand-black">{mobileMonthLabel}</p>
              <button
                type="button"
                aria-label="다음 달"
                onClick={goToNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-brand-gray"
              >
                &#8250;
              </button>
            </div>
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
                      {list.map((s) => {
                        const timeStr = new Date(s.start_at).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        });
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`w-full flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5 text-left ${
                              s.is_soft_deleted ? "opacity-60" : ""
                            }`}
                            onClick={() => setSelectedSchedule(s)}
                          >
                            <div className="w-6 h-6 rounded-full border border-white shadow-sm overflow-hidden bg-slate-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-slate-600">
                              {s.category === "leave" ? (
                                s.target_avatar_url ? (
                                  <img src={s.target_avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <span>{(s.target_full_name || s.manager_name || s.title)?.[0] || "?"}</span>
                                )
                              ) : s.creator_avatar_url ? (
                                <img src={s.creator_avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span>{s.creator_full_name?.[0] || "?"}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-semibold truncate ${
                                    s.is_soft_deleted ? "text-slate-400 line-through" : "text-brand-black"
                                  }`}
                                >
                                  {s.category === "leave" ? (
                                    `[월차] / ${s.target_full_name || s.manager_name || s.title}`
                                  ) : s.category === "dealer" ? (
                                    `${s.title} / ${timeStr}`
                                  ) : (
                                    `${s.title} / ${timeStr}`
                                  )}
                                </span>
                                {s.category !== "leave" && !s.is_all_day && (
                                  <span className="text-[10px] opacity-60 ml-2 whitespace-nowrap">
                                    {timeStr}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
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
            {/* 헤더: 로고 + 사용자 이름 */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                <img src="/2cigalender.png" alt="GALENDER 로고" className="h-9 w-auto" />
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-brand-black">GALENDER</p>
                <p className="text-xs text-brand-gray">
                  {userFullName ? `${userFullName}님, 환영합니다!` : "우리만의 GA 캘린더"}
                </p>
              </div>
            </div>

            {/* 네비게이션 */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <button
                className="w-full flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary rounded-lg text-left"
                onClick={() => { setMobileLeftOpen(false); router.push("/"); }}
              >
                <span className="text-sm font-medium">📅 Main Calendar</span>
              </button>

              {isAdmin && (
                <AdminSettingsMenu onNavigate={() => setMobileLeftOpen(false)} />
              )}

              {/* Branch Members 목록 */}
              <LeftPanelBranchMembers />

              {/* 로그아웃 */}
              <div className="pt-4 border-t border-slate-100">
                <form action="/api/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-brand-gray hover:bg-slate-50"
                  >
                    로그아웃
                  </button>
                </form>
              </div>
            </nav>
          </div>
          <button
            type="button"
            aria-label="닫기"
            className="flex-1 bg-black/40"
          />
        </div>
      )}

      {selectedSchedule && (
        <ScheduleDetailPopup
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </div>
  );
}
