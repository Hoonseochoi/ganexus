"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DesktopShell, { DesktopShellHamburger } from "./DesktopShell";
import Link from "next/link";
import CalendarMonthNav from "./CalendarMonthNav";
import CalendarGridClient from "./CalendarGridClient";
import MobileCalendarShell from "./MobileCalendarShell";
import RightPanel from "./RightPanel";
import RightPanelCollapseWrapper, { DesktopRightPanelProvider } from "./RightPanelCollapseWrapper";
import { ScheduleDetailPopup } from "./right-panel/ScheduleDetailPopup"; // Added import
import type { ScheduleItem } from "./right-panel/types"; // Added import
import dynamic from "next/dynamic";
const WeeklyScheduleClient = dynamic(() => import("./WeeklyScheduleClient"), {
  loading: () => <div className="flex-1 animate-pulse bg-slate-100 rounded-lg" />,
});
import type { CalendarMonthData } from "@/src/lib/calendar/month-view";
import {
  buildMonthCacheKey,
  invalidateMonthCache,
  readMonthCache,
  subscribeCalendarMonthDataChanged,
  writeMonthCache,
} from "@/src/lib/calendar/month-client-cache";

type Props = {
  leftPanel: React.ReactNode;
  initialMonthData: CalendarMonthData;
  initialSelectedDateStr: string | null;
  isAdmin: boolean;
  canAddSchedule: boolean;
  currentUserFullName?: string | null;
  branchName?: string | null;
};

export default function CalendarPageClientShell({
  leftPanel,
  initialMonthData,
  initialSelectedDateStr,
  isAdmin,
  canAddSchedule,
  currentUserFullName,
  branchName,
}: Props) {
  const [viewYear, setViewYear] = useState(initialMonthData.year);
  const [viewMonth, setViewMonth] = useState(initialMonthData.month);
  const [monthData, setMonthData] = useState(initialMonthData);
  const [selectedDateStr, setSelectedDateStr] = useState(initialSelectedDateStr);
  const [monthLoading, setMonthLoading] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);
  const [selectedScheduleForPopup, setSelectedScheduleForPopup] = useState<ScheduleItem | null>(null); // Added state
  const requestIdRef = useRef(0);

  useEffect(() => {
    writeMonthCache(
      buildMonthCacheKey(branchName, initialMonthData.year, initialMonthData.month),
      initialMonthData,
    );
    setViewYear(initialMonthData.year);
    setViewMonth(initialMonthData.month);
    setMonthData(initialMonthData);
    setSelectedDateStr(initialSelectedDateStr);
  }, [branchName, initialMonthData]);

  const syncUrl = useCallback((year: number, month: number, dateISO: string | null, replace: boolean) => {
    const params = new URLSearchParams(window.location.search);
    params.set("year", String(year));
    params.set("month", String(month + 1));
    if (dateISO) {
      params.set("date", dateISO);
    } else {
      params.delete("date");
    }

    const nextUrl = `/?${params.toString()}`;
    if (replace) {
      window.history.replaceState(null, "", nextUrl);
      return;
    }
    window.history.pushState(null, "", nextUrl);
  }, []);

  const loadMonth = useCallback(async (year: number, month: number, forceFresh = false) => {
    const cacheKey = buildMonthCacheKey(branchName, year, month);
    const cached = forceFresh ? null : readMonthCache(cacheKey);
    if (cached) {
      setMonthData(cached);
      setMonthLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setMonthLoading(true);

    try {
      const res = await fetch(`/api/schedules?year=${year}&month=${month + 1}`, {
        cache: "no-store",
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.monthData) {
        throw new Error(payload?.message ?? "월 일정 데이터를 불러오지 못했습니다.");
      }
      if (requestId !== requestIdRef.current) return;
      writeMonthCache(cacheKey, payload.monthData as CalendarMonthData);
      setMonthData(payload.monthData as CalendarMonthData);
    } finally {
      if (requestId === requestIdRef.current) {
        setMonthLoading(false);
      }
    }
  }, [branchName]);

  const navigateMonth = useCallback((year: number, month: number) => {
    setViewYear(year);
    setViewMonth(month);
    setSelectedDateStr(null);
    syncUrl(year, month, null, false);
    void loadMonth(year, month);
  }, [loadMonth, syncUrl]);

  const handleDateSelect = useCallback((dateISO: string | null) => {
    setSelectedDateStr(dateISO);
    syncUrl(viewYear, viewMonth, dateISO, true);
    // 날짜 클릭 시 주간일정 → 캘린더 상세로 전환
    if (dateISO) setShowWeekly(false);
  }, [syncUrl, viewMonth, viewYear]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextYear = Number(params.get("year") ?? initialMonthData.year);
      const nextMonth = Number(params.get("month") ?? initialMonthData.month + 1) - 1;
      const nextDate = params.get("date");

      if (Number.isNaN(nextYear) || Number.isNaN(nextMonth)) return;

      setViewYear(nextYear);
      setViewMonth(nextMonth);
      setSelectedDateStr(nextDate);
      void loadMonth(nextYear, nextMonth);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialMonthData.month, initialMonthData.year, loadMonth]);

  useEffect(() => subscribeCalendarMonthDataChanged(() => {
    invalidateMonthCache(branchName, viewYear, viewMonth);
    void loadMonth(viewYear, viewMonth, true);
  }), [branchName, loadMonth, viewMonth, viewYear]);

  const displayDateStr = useMemo(() => {
    if (selectedDateStr) return selectedDateStr;
    const today = monthData.todayStr;
    const [todayYear, todayMonth] = today.split("-").map((part, index) => index < 2 ? Number(part) : part);
    if (typeof todayYear === "number" && typeof todayMonth === "number") {
      if (viewYear === todayYear && viewMonth === todayMonth - 1) {
        return today;
      }
    }
    return null;
  }, [monthData.todayStr, selectedDateStr, viewMonth, viewYear]);

  const schedulesForSelected = useMemo(
    () => (displayDateStr ? monthData.eventsByDateStr[displayDateStr] ?? [] : []),
    [displayDateStr, monthData.eventsByDateStr],
  );

  return (
    <>
      <div className="hidden lg:flex h-full overflow-hidden">
        <DesktopShell leftPanel={leftPanel}>
          {/* ─── 항상 캘린더 표시 + 우측 패널에 주간일정 or 상세 토글 ─── */}
          <DesktopRightPanelProvider>
            <section className="flex-1 overflow-y-auto flex flex-col min-w-0 transition-[flex-basis] duration-300 ease-out">
              <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 bg-background-light z-10 bg-opacity-95 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <DesktopShellHamburger />
                  <CalendarMonthNav
                    year={viewYear}
                    month={viewMonth}
                    onNavigate={navigateMonth}
                    navigating={monthLoading}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowWeekly((v) => !v)}
                    className={`px-3 py-2 border rounded-lg text-sm font-semibold transition-colors ${
                      showWeekly
                        ? "bg-slate-800 border-slate-800 text-white"
                        : "bg-white border-slate-200 text-brand-gray hover:bg-slate-50"
                    }`}
                  >
                    주간일정
                  </button>
                </div>
              </header>

              <div className="flex-1 p-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full flex flex-col">
                  <CalendarGridClient
                    cells={monthData.cells}
                    eventsByDay={monthData.eventsByDay}
                    year={viewYear}
                    month={viewMonth}
                    isAdmin={isAdmin}
                    columns={5}
                    selectedDateStr={displayDateStr}
                    todayStr={monthData.todayStr}
                    onDateSelect={handleDateSelect}
                    openRightPanelOnSelect
                  />
                </div>
              </div>
            </section>

            {/* 우측 패널: 주간일정 or 일정 상세 */}
            {showWeekly ? (
              <div className="flex-shrink-0 w-[440px] border-l border-slate-200 bg-white overflow-hidden flex flex-col">
                <WeeklyScheduleClient
                  branchName={branchName}
                  isAdmin={isAdmin}
                  currentUserFullName={currentUserFullName}
                  onClose={() => setShowWeekly(false)}
                />
              </div>
            ) : (
              <RightPanelCollapseWrapper>
                <RightPanel
                  todaySchedules={schedulesForSelected}
                  selectedDateStr={displayDateStr}
                  isAdmin={isAdmin}
                  canAddSchedule={canAddSchedule}
                  currentUserFullName={currentUserFullName ?? null}
                  onScheduleSelectForPopup={setSelectedScheduleForPopup} // Pass the setter
                />
              </RightPanelCollapseWrapper>
            )}
          </DesktopRightPanelProvider>
        </DesktopShell>
      </div>

      <MobileCalendarShell
        key={`${viewYear}-${viewMonth}`}
        cells={monthData.cells}
        eventsByDay={monthData.eventsByDay}
        year={viewYear}
        month={viewMonth}
        isAdmin={isAdmin}
        todayStr={monthData.todayStr}
        mobileMonthLabel={monthData.mobileMonthLabel}
        eventsByDateStr={monthData.eventsByDateStr}
        userFullName={currentUserFullName ?? null}
        branchName={branchName ?? null}
        onMonthChange={navigateMonth}
        monthLoading={monthLoading}
        onScheduleSelectForPopup={setSelectedScheduleForPopup} // Pass the setter
      />

      {/* Central Schedule Detail Popup Modal */}
      {selectedScheduleForPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <ScheduleDetailPopup
              schedule={selectedScheduleForPopup}
              isAdmin={isAdmin}
              currentUserFullName={currentUserFullName}
              onClose={() => setSelectedScheduleForPopup(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}