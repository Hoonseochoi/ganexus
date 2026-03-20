"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Component, type TimelineDayGroup, type TimelineEventItem } from "@/components/ui/timeline-component";
import { ScheduleDetailPopup, type ScheduleItem } from "@/app/components/RightPanel";
import { notifyCalendarMonthDataChanged } from "@/src/lib/calendar/month-client-cache";

type ApiSchedule = {
  id: string;
  title: string;
  description: string | null;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  location: string | null;
  instructor: string | null;
  target_audience: string | null;
  manager_name: string | null;
  dealer_name?: string | null;
  is_soft_deleted?: boolean;
  creator_full_name?: string | null;
  target_full_name?: string | null;
  instructor_color?: string | null;
};

type Props = {
  branchName?: string | null;
  isAdmin?: boolean;
  currentUserFullName?: string | null;
  /** 인라인 패널 모드에서 닫기 콜백. 제공 시 compact 헤더로 렌더 */
  onClose?: () => void;
};

const LOAD_DAYS = 3;
const OBSERVER_COOLDOWN_MS = 250;

function addDays(base: Date, amount: number) {
  const next = new Date(base);
  next.setDate(next.getDate() + amount);
  return next;
}

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toKstDateKey(input: string) {
  return new Date(input).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function toKstDayLabel(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00+09:00`);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
  });
}

function toKstTimeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
}

function categoryToLabel(category: ApiSchedule["category"]) {
  if (category === "dealer") return "교육";
  if (category === "internal") return "내부";
  if (category === "personal") return "개인";
  if (category === "leave") return "월차";
  return "기타";
}

function collectDateKeys(start: Date, end: Date) {
  const keys: string[] = [];
  let cursor = new Date(start);
  while (cursor <= end) {
    keys.push(toISODate(cursor));
    cursor = addDays(cursor, 1);
  }
  return keys;
}

export default function WeeklyScheduleClient({ branchName, isAdmin, currentUserFullName, onClose }: Props) {
  const today = useMemo(() => new Date(), []);
  const [rangeStart, setRangeStart] = useState(() => addDays(today, -LOAD_DAYS));
  const [rangeEnd, setRangeEnd] = useState(() => addDays(today, LOAD_DAYS));
  const [eventsByDate, setEventsByDate] = useState<Record<string, TimelineEventItem[]>>({});
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef({ start: addDays(today, -LOAD_DAYS), end: addDays(today, LOAD_DAYS) });
  const requestedRangesRef = useRef<Set<string>>(new Set());
  const currentRequestRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);
  const observerCooldownRef = useRef(0);
  const rawScheduleMapRef = useRef<Map<string, ApiSchedule>>(new Map());
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [memoContent, setMemoContent] = useState("");
  const [memoSubmitting, setMemoSubmitting] = useState(false);
  const [memoError, setMemoError] = useState<string | null>(null);
  const [expandedMemos, setExpandedMemos] = useState<{ id: string; content: string; author_name: string | null; created_at: string }[]>([]);
  const [loadingMemos, setLoadingMemos] = useState(false);

  const mergeSchedules = useCallback((schedules: ApiSchedule[]) => {
    setEventsByDate((prev) => {
      const next: Record<string, TimelineEventItem[]> = { ...prev };
      const incomingByDate: Record<string, TimelineEventItem[]> = {};

      for (const schedule of schedules) {
        rawScheduleMapRef.current.set(schedule.id, schedule);
        const dateKey = toKstDateKey(schedule.start_at);
        const incomingList = incomingByDate[dateKey] ?? [];
        incomingList.push({
          id: schedule.id,
          title: schedule.title,
          description: schedule.description,
          timeLabel: toKstTimeLabel(schedule.start_at),
          categoryLabel: categoryToLabel(schedule.category),
          instructor: schedule.instructor,
          location: schedule.location,
          managerName: schedule.manager_name,
          targetAudience: schedule.target_audience,
          isSoftDeleted: schedule.is_soft_deleted,
          instructorColor: schedule.instructor_color ?? null,
        });
        incomingByDate[dateKey] = incomingList;
      }

      for (const dateKey of Object.keys(incomingByDate)) {
        const existing = next[dateKey] ?? [];
        const existingIds = new Set(existing.map((event) => event.id));
        const merged = existing.slice();

        for (const event of incomingByDate[dateKey]) {
          if (existingIds.has(event.id)) continue;
          merged.push(event);
        }

        merged.sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));
        next[dateKey] = merged;
      }

      return next;
    });
  }, []);

  const fetchRange = useCallback(async (from: Date, to: Date, force = false) => {
    const rangeKey = `${toISODate(from)}|${toISODate(to)}`;
    if (!force && requestedRangesRef.current.has(rangeKey)) {
      return;
    }
    requestedRangesRef.current.add(rangeKey);

    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }
    const controller = new AbortController();
    currentRequestRef.current = controller;
    const requestSeq = ++requestSeqRef.current;

    const params = new URLSearchParams({
      from: toISODate(from),
      to: toISODate(to),
    });

    try {
      const res = await fetch(`/api/schedules?${params.toString()}`, {
        cache: "no-store",
        signal: controller.signal,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.message ?? "주간일정 조회에 실패했습니다.");
      }
      if (requestSeq !== requestSeqRef.current) {
        return;
      }
      mergeSchedules((payload.schedules ?? []) as ApiSchedule[]);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      throw error;
    } finally {
      if (currentRequestRef.current === controller) {
        currentRequestRef.current = null;
      }
    }
  }, [mergeSchedules]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await fetchRange(rangeRef.current.start, rangeRef.current.end, true);
      } finally {
        if (mounted) {
          setInitialLoading(false);
        }
      }
    };
    void run();
    return () => {
      mounted = false;
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
      }
    };
  }, [fetchRange]);

  const loadPrev = useCallback(async () => {
    if (loadingPrev || initialLoading) return;
    setLoadingPrev(true);
    const oldStart = rangeRef.current.start;
    const nextStart = addDays(oldStart, -LOAD_DAYS);
    const prevEnd = addDays(oldStart, -1);

    const container = containerRef.current;
    const oldHeight = container?.scrollHeight ?? 0;

    try {
      await fetchRange(nextStart, prevEnd);
      rangeRef.current = { ...rangeRef.current, start: nextStart };
      setRangeStart(nextStart);
      requestAnimationFrame(() => {
        const newHeight = container?.scrollHeight ?? 0;
        if (container) {
          container.scrollTop += newHeight - oldHeight;
        }
      });
    } finally {
      setLoadingPrev(false);
    }
  }, [fetchRange, initialLoading, loadingPrev]);

  const loadNext = useCallback(async () => {
    if (loadingNext || initialLoading) return;
    setLoadingNext(true);
    const oldEnd = rangeRef.current.end;
    const nextStart = addDays(oldEnd, 1);
    const nextEnd = addDays(oldEnd, LOAD_DAYS);
    try {
      await fetchRange(nextStart, nextEnd);
      rangeRef.current = { ...rangeRef.current, end: nextEnd };
      setRangeEnd(nextEnd);
    } finally {
      setLoadingNext(false);
    }
  }, [fetchRange, initialLoading, loadingNext]);

  useEffect(() => {
    const root = containerRef.current;
    const top = topSentinelRef.current;
    const bottom = bottomSentinelRef.current;
    if (!root || !top || !bottom) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        if (now - observerCooldownRef.current < OBSERVER_COOLDOWN_MS) {
          return;
        }
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === top) {
            observerCooldownRef.current = now;
            void loadPrev();
          }
          if (entry.target === bottom) {
            observerCooldownRef.current = now;
            void loadNext();
          }
        }
      },
      {
        root,
        rootMargin: "140px 0px",
        threshold: 0.8,
      }
    );

    observer.observe(top);
    observer.observe(bottom);
    return () => observer.disconnect();
  }, [loadNext, loadPrev]);

  const buildScheduleItem = useCallback((eventId: string): ScheduleItem | null => {
    const raw = rawScheduleMapRef.current.get(eventId);
    if (!raw) return null;
    return {
      id: raw.id,
      title: raw.title,
      description: raw.description,
      start_at: raw.start_at,
      end_at: raw.end_at,
      is_all_day: raw.is_all_day,
      category: raw.category,
      location: raw.location ?? null,
      instructor: raw.instructor ?? null,
      target_audience: raw.target_audience ?? null,
      manager_name: raw.manager_name ?? null,
      dealer_name: raw.dealer_name ?? null,
      is_soft_deleted: raw.is_soft_deleted,
      creator_full_name: raw.creator_full_name ?? null,
      instructor_color: raw.instructor_color ?? null,
      target_full_name: raw.target_full_name ?? null,
    };
  }, []);

  const handleEventToggle = useCallback((eventId: string) => {
    setExpandedEventId((prev) => (prev === eventId ? null : eventId));
    setMemoContent("");
    setMemoError(null);
  }, []);

  const handleEventEdit = useCallback((eventId: string) => {
    const item = buildScheduleItem(eventId);
    if (item) setEditingSchedule(item);
  }, [buildScheduleItem]);

  const handleEventDelete = useCallback(async (eventId: string) => {
    if (!window.confirm("해당 일정을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/schedules/${eventId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message ?? "일정 삭제에 실패했습니다.");
        return;
      }
      notifyCalendarMonthDataChanged();
      setExpandedEventId(null);
      rawScheduleMapRef.current.delete(eventId);
      setEventsByDate((prev) => {
        const next: Record<string, TimelineEventItem[]> = {};
        for (const [key, evs] of Object.entries(prev)) {
          next[key] = evs.filter((e) => e.id !== eventId);
        }
        return next;
      });
    } catch {
      alert("네트워크 오류로 일정 삭제에 실패했습니다.");
    }
  }, []);

  const fetchExpandedMemos = useCallback(async (eventId: string) => {
    const raw = rawScheduleMapRef.current.get(eventId);
    if (!raw) return;
    const memoDate = new Date(raw.start_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
    setLoadingMemos(true);
    try {
      const res = await fetch(`/api/memos?date=${memoDate}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setExpandedMemos(data.memos ?? []);
    } catch {
      setExpandedMemos([]);
    } finally {
      setLoadingMemos(false);
    }
  }, []);

  useEffect(() => {
    if (!expandedEventId) {
      setExpandedMemos([]);
      return;
    }
    void fetchExpandedMemos(expandedEventId);
  }, [expandedEventId, fetchExpandedMemos]);

  const handleMemoSubmit = useCallback(async () => {
    if (!memoContent.trim() || memoSubmitting || !expandedEventId) return;
    setMemoError(null);
    setMemoSubmitting(true);
    try {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: memoContent.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMemoError(data.message ?? "메모 저장에 실패했습니다.");
        return;
      }
      setMemoContent("");
      await fetchExpandedMemos(expandedEventId);
    } catch {
      setMemoError("네트워크 오류로 메모 저장에 실패했습니다.");
    } finally {
      setMemoSubmitting(false);
    }
  }, [memoContent, memoSubmitting, expandedEventId, fetchExpandedMemos]);

  const renderEventFooter = useCallback((_eventId: string) => (
    <div className="rounded-b-lg border border-t-0 border-slate-200 bg-slate-50 px-3 pt-3 pb-4 space-y-3">
      {loadingMemos ? (
        <p className="text-xs text-brand-gray">메모 불러오는 중...</p>
      ) : expandedMemos.length > 0 ? (
        <div className="space-y-2">
          {expandedMemos.map((m) => (
            <div key={m.id} className="rounded-lg bg-white border border-slate-100 px-2.5 py-2">
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{m.content}</p>
              <p className="text-[10px] text-brand-gray mt-0.5">
                {m.author_name ?? "알 수 없음"} ·{" "}
                {new Date(m.created_at).toLocaleString("ko-KR", {
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-brand-gray">메모가 없습니다.</p>
      )}
      {memoError && <p className="text-xs text-rose-600">{memoError}</p>}
      <div className="flex gap-2 items-end">
        <textarea
          value={memoContent}
          onChange={(e) => setMemoContent(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-white"
          rows={2}
          disabled={memoSubmitting}
        />
        <button
          type="button"
          onClick={handleMemoSubmit}
          disabled={memoSubmitting || !memoContent.trim()}
          className="px-3 py-2 h-[68px] rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          {memoSubmitting ? "..." : "추가"}
        </button>
      </div>
    </div>
  ), [expandedMemos, loadingMemos, memoContent, memoError, memoSubmitting, handleMemoSubmit]);

  const dayGroups = useMemo<TimelineDayGroup[]>(() => {
    const keys = collectDateKeys(rangeStart, rangeEnd);
    return keys
      .map((dateISO) => ({
        dateISO,
        dateLabel: toKstDayLabel(dateISO),
        events: eventsByDate[dateISO] ?? [],
      }))
      .filter((day) => day.events.length > 0);
  }, [eventsByDate, rangeEnd, rangeStart]);

  if (!branchName) {
    return (
      <div className="h-full grid place-items-center px-4">
        <p className="text-sm text-brand-gray">지점 정보가 없어 주간일정을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-slate-200 bg-background-light/95 backdrop-blur-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-brand-gray">{branchName} 지점</p>
            <h1 className={`font-bold text-brand-black ${onClose ? "text-sm" : "text-base md:text-lg"}`}>주간일정</h1>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-brand-gray hover:bg-slate-50 transition-colors"
            >
              ← 캘린더
            </button>
          ) : (
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-brand-gray hover:bg-slate-50"
            >
              캘린더
            </Link>
          )}
        </div>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div>
          <p className="text-xs text-brand-gray mb-3">위/아래로 당기면 3일 단위로 추가 로드됩니다.</p>

          <div ref={topSentinelRef} className="h-8 grid place-items-center text-[11px] text-brand-gray">
            {loadingPrev ? "이전 3일 로드 중..." : "위로 당겨 이전 일정 불러오기"}
          </div>

          {initialLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-brand-gray">
              주간일정을 불러오는 중입니다...
            </div>
          ) : (
            <Component
              days={dayGroups}
              expandedEventId={expandedEventId}
              onEventToggle={handleEventToggle}
              onEventEdit={handleEventEdit}
              onEventDelete={handleEventDelete}
              renderEventFooter={renderEventFooter}
            />
          )}

          <div ref={bottomSentinelRef} className="h-8 grid place-items-center text-[11px] text-brand-gray">
            {loadingNext ? "다음 3일 로드 중..." : "아래로 당겨 다음 일정 불러오기"}
          </div>
        </div>
      </div>

      {editingSchedule && (
        <ScheduleDetailPopup
          schedule={editingSchedule}
          isAdmin={isAdmin}
          currentUserFullName={currentUserFullName}
          onClose={() => setEditingSchedule(null)}
        />
      )}
    </div>
  );
}
