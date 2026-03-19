import { memo } from "react";
import { cn } from "@/src/lib/utils";
import { MovingBorder } from "@/components/ui/moving-border";

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
  instructorColor?: string | null;
};

export type TimelineDayGroup = {
  dateISO: string;
  dateLabel: string;
  events: TimelineEventItem[];
};

type ComponentProps = {
  days?: TimelineDayGroup[];
  expandedEventId?: string | null;
  onEventToggle?: (eventId: string) => void;
  onEventEdit?: (eventId: string) => void;
  onEventDelete?: (eventId: string) => void;
  renderEventFooter?: (eventId: string) => React.ReactNode;
};

function parseHexColor(hex: string | null | undefined): { r: number; g: number; b: number } | null {
  if (!hex) return null;
  const normalized = hex.trim();
  const short = normalized.match(/^#([0-9a-fA-F]{3})$/);
  if (short) {
    const [r, g, b] = short[1].split("").map((ch) => parseInt(ch + ch, 16));
    return { r, g, b };
  }
  const full = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (full) {
    const value = full[1];
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

/**
 * Modern Glassmorphism Timeline
 * - Vertical timeline with glowing nodes
 * - Glassy cards for content
 * - Dark/Light theme support
 */
export const Component = memo(function Component({
  days = [],
  expandedEventId,
  onEventToggle,
  onEventEdit,
  onEventDelete,
  renderEventFooter,
}: ComponentProps) {
  const items = days;
  const todayISO = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });

  if (items.length === 0) {
    return (
      <div className="relative max-w-3xl mx-auto py-6 px-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-brand-gray">
          표시할 일정이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto py-6 px-4">
      <div className="absolute left-[18px] top-0 h-full w-[2px] bg-gradient-to-b from-blue-400/60 to-sky-500/60" />

      <div className="space-y-10">
        {items.map((day) => {
          const isToday = day.dateISO === todayISO;
          return (
            <div
              key={day.dateISO}
              className={cn(
                "relative rounded-2xl p-3",
                isToday ? "bg-primary/5 border border-primary/30" : ""
              )}
            >
              {isToday ? (
                <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                  <MovingBorder duration={3380} rx="14" ry="14">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(239,59,36,0.65)]" />
                  </MovingBorder>
                </div>
              ) : null}

              <div className="relative flex gap-6 items-start animate-fade-in">
                <div className="relative z-10 mt-1">
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2 border-white",
                      isToday
                        ? "bg-gradient-to-r from-primary to-red-500 shadow-[0_0_14px_rgba(239,59,36,0.75)]"
                        : "bg-gradient-to-r from-blue-400 to-sky-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]",
                      "transition-transform duration-200 hover:scale-110"
                    )}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">{day.dateLabel}</div>
                    {isToday ? (
                      <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        TODAY
                      </span>
                    ) : null}
                  </div>

                  {day.events.map((event) => {
                    const isExpanded = expandedEventId === event.id;
                    const hex = parseHexColor(event.instructorColor);
                    const cardStyle: React.CSSProperties | undefined = hex
                      ? {
                          borderColor: `rgb(${hex.r} ${hex.g} ${hex.b})`,
                          backgroundColor: `rgba(${hex.r}, ${hex.g}, ${hex.b}, 0.08)`,
                        }
                      : undefined;
                    const defaultCardClass = isToday
                      ? "bg-white border border-primary/25 shadow-[0_8px_32px_rgba(239,59,36,0.14)]"
                      : "bg-white/75 border border-gray-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)]";
                    const cardColorClass = hex ? "border" : defaultCardClass;
                    return (
                      <div key={event.id}>
                        <button
                          type="button"
                          onClick={() => onEventToggle?.(event.id)}
                          className={cn(
                            "w-full text-left rounded-lg p-4 backdrop-blur-xl",
                            cardColorClass,
                            "hover:shadow-[0_10px_36px_rgba(0,0,0,0.15)] transition-all duration-300",
                            isExpanded ? "!rounded-b-none" : "",
                            onEventToggle ? "cursor-pointer" : "",
                            event.isSoftDeleted ? "opacity-60" : ""
                          )}
                          style={cardStyle}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-[11px] text-blue-700 font-semibold">
                              <span>{event.timeLabel}</span>
                              <span className="text-slate-300">|</span>
                              <span>{event.categoryLabel}</span>
                            </div>
                            {isExpanded && (onEventEdit || onEventDelete) && (
                              <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {onEventEdit && (
                                  <button
                                    type="button"
                                    onClick={() => onEventEdit(event.id)}
                                    className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"
                                    aria-label="일정 수정"
                                  >
                                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                )}
                                {onEventDelete && (
                                  <button
                                    type="button"
                                    onClick={() => onEventDelete(event.id)}
                                    className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-200 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
                                    aria-label="일정 삭제"
                                  >
                                    <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                      <path d="M10 11v6M14 11v6" />
                                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <h3 className="mt-1 text-base font-semibold text-gray-900">{event.title}</h3>
                          {event.description ? (
                            <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{event.description}</p>
                          ) : null}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <p>교육자: {event.instructor || "-"}</p>
                            <p>장소: {event.location || "-"}</p>
                          </div>
                        </button>
                        {isExpanded && renderEventFooter ? (
                          <div className="animate-fade-in">
                            {renderEventFooter(event.id)}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Component.displayName = "TimelineComponent";
