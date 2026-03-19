"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Component, type TimelineDayGroup, type TimelineEventItem } from "@/components/ui/timeline-component";

type ApiSchedule = {
  id: string;
  title: string;
  description: string | null;
  category: "dealer" | "internal" | "personal" | "leave" | "etc";
  start_at: string;
  location: string | null;
  instructor: string | null;
  target_audience: string | null;
  manager_name: string | null;
  is_soft_deleted?: boolean;
};

type Props = {
  branchName?: string | null;
};

const LOAD_DAYS = 3;

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

export default function WeeklyScheduleClient({ branchName }: Props) {
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

  const mergeSchedules = useCallback((schedules: ApiSchedule[]) => {
    setEventsByDate((prev) => {
      const next: Record<string, TimelineEventItem[]> = { ...prev };
      for (const schedule of schedules) {
        const dateKey = toKstDateKey(schedule.start_at);
        const list = next[dateKey] ? [...next[dateKey]] : [];
        const exists = list.some((event) => event.id === schedule.id);
        if (exists) {
          continue;
        }
        list.push({
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
        });
        list.sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));
        next[dateKey] = list;
      }
      return next;
    });
  }, []);

  const fetchRange = useCallback(async (from: Date, to: Date) => {
    const params = new URLSearchParams({
      from: toISODate(from),
      to: toISODate(to),
    });
    const res = await fetch(`/api/schedules?${params.toString()}`, { cache: "no-store" });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload?.message ?? "주간일정 조회에 실패했습니다.");
    }
    mergeSchedules((payload.schedules ?? []) as ApiSchedule[]);
  }, [mergeSchedules]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        await fetchRange(rangeStart, rangeEnd);
      } finally {
        if (mounted) {
          setInitialLoading(false);
        }
      }
    };
    void run();
    return () => {
      mounted = false;
    };
  }, [fetchRange, rangeEnd, rangeStart]);

  const loadPrev = useCallback(async () => {
    if (loadingPrev || initialLoading) return;
    setLoadingPrev(true);
    const oldStart = rangeStart;
    const nextStart = addDays(oldStart, -LOAD_DAYS);
    const prevEnd = addDays(oldStart, -1);

    const container = containerRef.current;
    const oldHeight = container?.scrollHeight ?? 0;

    try {
      await fetchRange(nextStart, prevEnd);
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
  }, [fetchRange, initialLoading, loadingPrev, rangeStart]);

  const loadNext = useCallback(async () => {
    if (loadingNext || initialLoading) return;
    setLoadingNext(true);
    const oldEnd = rangeEnd;
    const nextStart = addDays(oldEnd, 1);
    const nextEnd = addDays(oldEnd, LOAD_DAYS);
    try {
      await fetchRange(nextStart, nextEnd);
      setRangeEnd(nextEnd);
    } finally {
      setLoadingNext(false);
    }
  }, [fetchRange, initialLoading, loadingNext, rangeEnd]);

  useEffect(() => {
    const root = containerRef.current;
    const top = topSentinelRef.current;
    const bottom = bottomSentinelRef.current;
    if (!root || !top || !bottom) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target === top) {
            void loadPrev();
          }
          if (entry.target === bottom) {
            void loadNext();
          }
        }
      },
      {
        root,
        threshold: 0.8,
      }
    );

    observer.observe(top);
    observer.observe(bottom);
    return () => observer.disconnect();
  }, [loadNext, loadPrev]);

  const dayGroups = useMemo<TimelineDayGroup[]>(() => {
    const keys = collectDateKeys(rangeStart, rangeEnd);
    return keys.map((dateISO) => ({
      dateISO,
      dateLabel: toKstDayLabel(dateISO),
      events: eventsByDate[dateISO] ?? [],
    }));
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
      <header className="border-b border-slate-200 bg-white/85 backdrop-blur-sm px-4 md:px-6 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-brand-gray">{branchName} 지점</p>
            <h1 className="text-base md:text-lg font-bold text-brand-black">주간일정 타임라인</h1>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-brand-gray hover:bg-slate-50"
          >
            MainCalender
          </Link>
        </div>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-brand-gray mb-3">위/아래로 당기면 3일 단위로 추가 로드됩니다.</p>

          <div ref={topSentinelRef} className="h-8 grid place-items-center text-[11px] text-brand-gray">
            {loadingPrev ? "이전 3일 로드 중..." : "위로 당겨 이전 일정 불러오기"}
          </div>

          {initialLoading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-brand-gray">
              주간일정을 불러오는 중입니다...
            </div>
          ) : (
            <Component days={dayGroups} />
          )}

          <div ref={bottomSentinelRef} className="h-8 grid place-items-center text-[11px] text-brand-gray">
            {loadingNext ? "다음 3일 로드 중..." : "아래로 당겨 다음 일정 불러오기"}
          </div>
        </div>
      </div>
    </div>
  );
}
