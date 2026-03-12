"use client";

import { useRouter } from "next/navigation";
import CalendarCellDropZone from "./CalendarCellDropZone";
import DraggableSchedulePill from "./DraggableSchedulePill";

type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: string;
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
  columns: 5 | 7;
};

export default function CalendarGridClient({
  cells,
  eventsByDay,
  year,
  month,
  isAdmin,
  columns,
}: Props) {
  const router = useRouter();

  const handleCellClick = (dateISO: string | null) => {
    if (!dateISO) return;
    const params = new URLSearchParams();
    params.set("year", String(year));
    params.set("month", String(month + 1));
    params.set("date", dateISO);
    router.push(`/?${params.toString()}`);
  };

  const weekdays = columns === 5 ? ["월", "화", "수", "목", "금"] : ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <>
      <div className={`grid ${columns === 5 ? "grid-cols-5" : "grid-cols-7"} bg-slate-50 border-b border-slate-200`}>
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
        {cells.map((cell) => {
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

          return (
            <CalendarCellDropZone
              key={cell.key}
              dateISO={cell.dateISO}
              isEmpty={cell.day === null}
              className={`p-2 min-h-[70px] lg:min-h-[120px] cursor-pointer ${
                cell.isToday
                  ? "border-2 border-primary bg-primary/5 relative"
                  : "border border-slate-100"
              }`}
            >
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleCellClick(cell.dateISO)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCellClick(cell.dateISO);
                }}
                className="w-full h-full text-left"
              >
                <span className={`text-sm ${dayWeight} ${dayColor}`}>
                  {cell.day ?? ""}
                </span>
                {cell.day !== null && events.length > 0 && (
                  <div className="mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                    {events.slice(0, 3).map((ev) => (
                      <DraggableSchedulePill
                        key={ev.id}
                        schedule={{
                          id: ev.id,
                          title: ev.title,
                          start_at: ev.start_at,
                          end_at: ev.end_at,
                          is_all_day: ev.is_all_day,
                        }}
                        isAdmin={isAdmin}
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
            </CalendarCellDropZone>
          );
        })}
      </div>
    </>
  );
}
