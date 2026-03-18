"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type Props = {
  year: number;
  month: number; // 0-index
  onNavigate?: (year: number, month: number) => void;
  navigating?: boolean;
};

export default function CalendarMonthNav({ year, month, onNavigate, navigating: navigatingProp = false }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const label = `${String(year).slice(2)}.${String(month + 1).padStart(2, "0")}`;

  const buildHref = (y: number, m: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("year", String(y));
    params.set("month", String(m + 1));
    return `/?${params.toString()}`;
  };

  useEffect(() => {
    if (onNavigate) return;
    // 다음/이전 달 이동 체감을 줄이기 위해 인접 월을 미리 프리패치한다.
    router.prefetch(buildHref(prevYear, prevMonth));
    router.prefetch(buildHref(nextYear, nextMonth));
  }, [
    month,
    year,
    nextMonth,
    nextYear,
    prevMonth,
    prevYear,
    router,
    searchParams,
  ]);

  const go = (y: number, m: number) => {
    if (onNavigate) {
      onNavigate(y, m);
      return;
    }
    setNavigating(true);
    router.push(buildHref(y, m));
    // 너무 길게 남지 않도록 안전 타임아웃
    setTimeout(() => setNavigating(false), 600);
  };

  const isNavigating = onNavigate ? navigatingProp : navigating;

  const goToday = () => {
    const now = new Date();
    go(now.getFullYear(), now.getMonth());
  };

  return (
    <div className={`flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 ${isNavigating ? "opacity-70" : ""}`}>
      <EclipseButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => go(prevYear, prevMonth)}
        aria-label="이전 달"
        className="!h-8 !w-8 !min-w-0 !p-0"
        disabled={isNavigating}
      >
        {"<"}
      </EclipseButton>
      <EclipseButton
        type="button"
        variant="ghost"
        size="sm"
        text={label}
        onClick={goToday}
        aria-label="현재 달로 이동"
        className="min-w-[3.5rem] !normal-case !tracking-normal font-calendar"
        disabled={isNavigating}
      />
      <EclipseButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => go(nextYear, nextMonth)}
        aria-label="다음 달"
        className="!h-8 !w-8 !min-w-0 !p-0"
        disabled={isNavigating}
      >
        {">"}
      </EclipseButton>
    </div>
  );
}
