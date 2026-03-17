"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type Props = {
  year: number;
  month: number; // 0-index
};

export default function CalendarMonthNav({ year, month }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const label = `${String(year).slice(2)}.${String(month + 1).padStart(2, "0")}`;

  const go = (y: number, m: number) => {
    setNavigating(true);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("year", String(y));
    params.set("month", String(m + 1));
    router.push(`/?${params.toString()}`);
    // 너무 길게 남지 않도록 안전 타임아웃
    setTimeout(() => setNavigating(false), 600);
  };

  const goToday = () => {
    const now = new Date();
    go(now.getFullYear(), now.getMonth());
  };

  return (
    <div className={`flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 ${navigating ? "opacity-70" : ""}`}>
      <EclipseButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => go(prevYear, prevMonth)}
        aria-label="이전 달"
        className="!h-8 !w-8 !min-w-0 !p-0"
        disabled={navigating}
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
        disabled={navigating}
      />
      <EclipseButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => go(nextYear, nextMonth)}
        aria-label="다음 달"
        className="!h-8 !w-8 !min-w-0 !p-0"
        disabled={navigating}
      >
        {">"}
      </EclipseButton>
    </div>
  );
}
