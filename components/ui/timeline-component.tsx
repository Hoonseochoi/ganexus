import { memo } from "react";
import { cn } from "@/src/lib/utils";

export type TimelineEventItem = {
  id: string;
  title: string;
  description?: string | null;
  timeLabel: string;
  categoryLabel: string;
  instructor?: string | null;
  location?: string | null;
  managerName?: string | null;
  targetAudience?: string | null;
  isSoftDeleted?: boolean;
};

export type TimelineDayGroup = {
  dateISO: string;
  dateLabel: string;
  events: TimelineEventItem[];
};

type ComponentProps = {
  days?: TimelineDayGroup[];
};

/**
 * Modern Glassmorphism Timeline
 * - Vertical timeline with glowing nodes
 * - Glassy cards for content
 * - Dark/Light theme support
 */
export const Component = memo(function Component({ days = [] }: ComponentProps) {
  const fallback: TimelineDayGroup[] = [
    {
      dateISO: "2026-03-16",
      dateLabel: "2026.03.16 (월)",
      events: [
        {
          id: "fallback-1",
          title: "주간 일정 예시",
          description: "실제 데이터가 없을 때 보이는 기본 카드입니다.",
          timeLabel: "09:00",
          categoryLabel: "내부",
        },
      ],
    },
  ];

  const items = days.length > 0 ? days : fallback;

  return (
    <div className="relative max-w-3xl mx-auto py-6 px-4">
      <div className="absolute left-[18px] top-0 h-full w-[2px] bg-gradient-to-b from-blue-400/60 to-sky-500/60" />

      <div className="space-y-10">
        {items.map((day) => (
          <div key={day.dateISO} className="relative flex gap-6 items-start animate-fade-in">
            <div className="relative z-10 mt-1">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 border-white",
                  "bg-gradient-to-r from-blue-400 to-sky-500",
                  "shadow-[0_0_12px_rgba(59,130,246,0.6)]",
                  "transition-transform duration-200 hover:scale-110"
                )}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">{day.dateLabel}</div>

              {day.events.length === 0 ? (
                <div
                  className={cn(
                    "rounded-lg p-4 backdrop-blur-xl",
                    "bg-white/70 border border-gray-200/60",
                    "shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                  )}
                >
                  <p className="text-sm text-gray-600">등록된 일정이 없습니다.</p>
                </div>
              ) : (
                day.events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg p-4 backdrop-blur-xl",
                      "bg-white/75 border border-gray-200/60",
                      "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
                      "hover:shadow-[0_10px_36px_rgba(0,0,0,0.15)] transition-all duration-300",
                      event.isSoftDeleted ? "opacity-60" : ""
                    )}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-blue-700 font-semibold">
                      <span>{event.timeLabel}</span>
                      <span className="text-slate-300">|</span>
                      <span>{event.categoryLabel}</span>
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-gray-900">{event.title}</h3>
                    {event.description ? (
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    ) : null}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <p>강사: {event.instructor || "-"}</p>
                      <p>장소: {event.location || "-"}</p>
                      <p>대상: {event.targetAudience || "-"}</p>
                      <p>담당: {event.managerName || "-"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

Component.displayName = "TimelineComponent";
