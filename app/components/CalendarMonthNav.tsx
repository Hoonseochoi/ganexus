"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  year: number;
  month: number; // 0-index
};

export default function CalendarMonthNav({ year, month }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  const label = `${String(year).slice(2)}.${String(month + 1).padStart(2, "0")}`;

  const go = (y: number, m: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("year", String(y));
    params.set("month", String(m + 1));
    router.push(`/?${params.toString()}`);
  };

  const goToday = () => {
    const now = new Date();
    go(now.getFullYear(), now.getMonth());
  };

  return (
    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={() => go(prevYear, prevMonth)}
        className="p-1 hover:bg-slate-100 rounded transition-colors"
        aria-label="이전 달"
      >
        {"<"}
      </button>
      <button
        type="button"
        onClick={goToday}
        className="px-3 text-xs font-bold text-brand-black min-w-[3.5rem] hover:bg-slate-100 rounded transition-colors"
        aria-label="현재 달로 이동"
      >
        {label}
      </button>
      <button
        type="button"
        onClick={() => go(nextYear, nextMonth)}
        className="p-1 hover:bg-slate-100 rounded transition-colors"
        aria-label="다음 달"
      >
        {">"}
      </button>
    </div>
  );
}
