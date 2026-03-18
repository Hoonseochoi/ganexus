"use client";

import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import CalendarCellDropZone from "./CalendarCellDropZone";
import DraggableSchedulePill from "./DraggableSchedulePill";
import { useRightPanel } from "./RightPanelCollapseWrapper";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { ScheduleAddScheduler } from "@/app/admin/schedules/_components/ScheduleAddScheduler";
import { notifyCalendarMonthDataChanged } from "@/src/lib/calendar/month-client-cache";

const ADD_META_CACHE_TTL_MS = 5 * 60 * 1000;

type AddMetaCache = {
  expiresAt: number;
  userFullName: string;
  instructors: Instructor[];
};

let addMetaCache: AddMetaCache | null = null;
let addMetaInFlight: Promise<AddMetaCache> | null = null;

async function fetchAddMeta(): Promise<AddMetaCache> {
  if (addMetaCache && addMetaCache.expiresAt > Date.now()) {
    return addMetaCache;
  }

  if (addMetaInFlight) {
    return addMetaInFlight;
  }

  addMetaInFlight = (async () => {
    const [profileRes, managersRes] = await Promise.all([
      fetch("/api/auth/profile", { cache: "no-store" }),
      fetch("/api/admin/managers", { cache: "no-store" }),
    ]);

    const profileData = await profileRes.json().catch(() => ({}));
    const userFullName = profileRes.ok
      ? (profileData?.user?.profile?.full_name ?? "관리자")
      : "관리자";

    let instructors: Instructor[] = [];
    const managersData = await managersRes.json().catch(() => ({}));
    if (managersRes.ok && Array.isArray(managersData.managers)) {
      instructors = managersData.managers
        .filter((m: any) => m.is_instructor)
        .map((m: any) => ({
          id: m.id as string,
          name: m.name as string,
          instructor_color: (m.instructor_color as string) ?? null,
        }));
    }

    const nextCache: AddMetaCache = {
      expiresAt: Date.now() + ADD_META_CACHE_TTL_MS,
      userFullName,
      instructors,
    };
    addMetaCache = nextCache;
    return nextCache;
  })();

  try {
    return await addMetaInFlight;
  } finally {
    addMetaInFlight = null;
  }
}

type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: string;
  creator_full_name?: string | null;
  creator_avatar_url?: string | null;
  target_full_name?: string | null;
  target_avatar_url?: string | null;
  manager_name?: string | null;
  instructor?: string | null;
  instructor_color?: string | null;
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

export type CalendarGridProps = {
  cells: CellData[];
  eventsByDay: Record<string, ScheduleItem[]>;
  year: number;
  month: number;
  isAdmin: boolean;
  columns: 5 | 7;
  selectedDateStr: string | null;
  todayStr: string;
  onDateSelect?: (dateISO: string | null) => void;
  openRightPanelOnSelect?: boolean;
  detailDateISO?: string | null;
  renderDetailRow?: (dateISO: string) => React.ReactNode;
};

type Instructor = {
  id: string;
  name: string;
  instructor_color: string | null;
};

function CalendarGridClientBase({
  cells,
  eventsByDay,
  year,
  month,
  isAdmin,
  columns,
  selectedDateStr,
  todayStr,
  onDateSelect,
  openRightPanelOnSelect = false,
  detailDateISO,
  renderDetailRow,
}: CalendarGridProps) {
  const router = useRouter();
  const rightPanel = useRightPanel();
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [addDateISO, setAddDateISO] = useState<string | null>(null);
  const [addLoadingMeta, setAddLoadingMeta] = useState(false);
  const [addMetaError, setAddMetaError] = useState<string | null>(null);
  const [addUserFullName, setAddUserFullName] = useState("관리자");
  const [addInstructors, setAddInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    const warm = () => {
      void fetchAddMeta().catch(() => undefined);
    };

    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    }).requestIdleCallback;

    if (typeof idle === "function") {
      const idleId = idle(warm, { timeout: 1200 });
      return () => {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = window.setTimeout(warm, 600);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!addPopupOpen) return;
    let cancelled = false;

    const loadMeta = async () => {
      setAddMetaError(null);

      if (addMetaCache && addMetaCache.expiresAt > Date.now()) {
        setAddUserFullName(addMetaCache.userFullName);
        setAddInstructors(addMetaCache.instructors);
        setAddLoadingMeta(false);
        return;
      }

      setAddLoadingMeta(true);
      try {
        const meta = await fetchAddMeta();

        if (!cancelled) {
          setAddUserFullName(meta.userFullName);
          setAddInstructors(meta.instructors);
        }
      } catch {
        if (!cancelled) {
          setAddMetaError("일정 작성 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setAddLoadingMeta(false);
        }
      }
    };

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [addPopupOpen]);

  const handleCellClick = useCallback((dateISO: string | null) => {
    // 모바일 등 onDateSelect 를 사용하는 경우: 상위에서 날짜 선택 상태만 제어
    if (onDateSelect) {
      onDateSelect(dateISO);
      if (openRightPanelOnSelect && dateISO) {
        rightPanel?.setOpen(true);
      }
      return;
    }
    // 데스크톱: URL 쿼리로 이동 + 우측 패널 오픈
    if (!dateISO) return;
    const params = new URLSearchParams();
    params.set("year", String(year));
    params.set("month", String(month + 1));
    params.set("date", dateISO);
    router.push(`/?${params.toString()}`);
    rightPanel?.setOpen(true);
  }, [month, onDateSelect, openRightPanelOnSelect, rightPanel, router, year]);

  const weekdays = useMemo(
    () => (columns === 5 ? ["월", "화", "수", "목", "금"] : ["일", "월", "화", "수", "목", "금", "토"]),
    [columns],
  );

  const rows = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let i = 0; i < cells.length; i += columns) {
      const rowCells = cells.slice(i, i + columns);
      result.push(
        rowCells.map((cell) => {
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

          const isSelected =
            cell.day !== null &&
            cell.dateISO != null &&
            selectedDateStr != null &&
            cell.dateISO === selectedDateStr;
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
                    <div className="mt-1 space-y-0.5" onClick={(e) => e.stopPropagation()}>
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
                            creator_full_name: ev.creator_full_name,
                            creator_avatar_url: ev.creator_avatar_url,
                            target_full_name: ev.target_full_name,
                            target_avatar_url: ev.target_avatar_url,
                            manager_name: ev.manager_name,
                            instructor: ev.instructor,
                            instructor_color: ev.instructor_color,
                          }}
                          isAdmin={isAdmin}
                          onPillClick={() => handleCellClick(cell.dateISO)}
                          hideAvatar={columns === 5}
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
                        setAddDateISO(cell.dateISO);
                        setAddPopupOpen(true);
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
        }),
      );

      if (
        detailDateISO &&
        renderDetailRow &&
        rowCells.some((c) => c.dateISO && c.dateISO === detailDateISO)
      ) {
        result.push(
          <div
            key={`detail-${detailDateISO}-${i}`}
            className={columns === 5 ? "col-span-5" : "col-span-7"}
          >
            {renderDetailRow(detailDateISO)}
          </div>,
        );
      }
    }
    return result;
  }, [cells, columns, detailDateISO, eventsByDay, renderDetailRow, selectedDateStr, todayStr, handleCellClick]);

  const closeAddPopup = useCallback(() => {
    setAddPopupOpen(false);
    setAddDateISO(null);
    setAddMetaError(null);
  }, []);

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
        {rows}
      </div>

      {addPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/40 overflow-y-auto" onClick={closeAddPopup}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-6xl w-full my-3 sm:my-4 max-h-none sm:max-h-[95vh] overflow-visible sm:overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-base font-bold text-brand-black">일정 추가하기</h3>
              <EclipseButton
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeAddPopup}
                aria-label="일정 추가 팝업 닫기"
                className="!h-8 !w-8 !min-w-0 !p-0"
              >
                ×
              </EclipseButton>
            </div>
            <div className="p-4">
              {addMetaError && (
                <p className="mb-3 text-xs text-rose-600">{addMetaError}</p>
              )}
              {addLoadingMeta ? (
                <p className="text-xs text-brand-gray">일정 작성 정보를 불러오는 중...</p>
              ) : (
                <ScheduleAddScheduler
                  mode="create"
                  userFullName={addUserFullName}
                  instructors={addInstructors}
                  initialDateISO={addDateISO}
                  onSuccess={() => {
                    notifyCalendarMonthDataChanged();
                    closeAddPopup();
                    router.refresh();
                  }}
                />
              )}
              </div>
          </div>
        </div>
      )}
    </>
  );
}

const CalendarGridClient = memo(CalendarGridClientBase);

export default CalendarGridClient;
