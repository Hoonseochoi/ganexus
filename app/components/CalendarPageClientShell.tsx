"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DesktopShell, { DesktopShellHamburger } from "./DesktopShell";
import Link from "next/link";
import CalendarMonthNav from "./CalendarMonthNav";
import CalendarGridClient from "./CalendarGridClient";
import MobileCalendarShell from "./MobileCalendarShell";
import RightPanel from "./RightPanel";
import RightPanelCollapseWrapper, { DesktopRightPanelProvider } from "./RightPanelCollapseWrapper";
import WeeklyScheduleClient from "./WeeklyScheduleClient";
import { BackButton } from "@/app/components/ui/back-button";
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
          {showWeekly ? (
            /* ─── 주간일정 모드: 우측패널 대신 전체 화면으로 ─── */
            <section className="flex-1 overflow-hidden flex flex-col min-w-0">
              <header className="h-16 border-b border-slate-200 flex items-center gap-4 px-6 sticky top-0 bg-background-light z-10 backdrop-blur-sm">
                <DesktopShellHamburger />
                <BackButton onClick={() => setShowWeekly(false)} />
                <span className="text-sm font-semibold text-brand-black">주간일정</span>
              </header>
              <div className="flex-1 overflow-hidden">
                <WeeklyScheduleClient
                  branchName={branchName}
                  isAdmin={isAdmin}
                  currentUserFullName={currentUserFullName}
                />
              </div>
            </section>
          ) : (
            /* ─── 기본 캘린더 모드 ─── */
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
                      onClick={() => setShowWeekly(true)}
                      className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-brand-gray font-semibold hover:bg-slate-50 transition-colors"
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

              <RightPanelCollapseWrapper>
                <RightPanel
                  todaySchedules={schedulesForSelected}
                  selectedDateStr={displayDateStr}
                  isAdmin={isAdmin}
                  canAddSchedule={canAddSchedule}
                  currentUserFullName={currentUserFullName ?? null}
                />
              </RightPanelCollapseWrapper>
            </DesktopRightPanelProvider>
          )}
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
      />
    </>
  );
}