"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import type { ScheduleItem } from "./types";
import { formatTime, parseHexColor } from "./types";

type Props = {
  schedules: ScheduleItem[];
  isAdmin: boolean;
  onSelect: (s: ScheduleItem) => void;
};

export function ScheduleList({ schedules, isAdmin, onSelect }: Props) {
  if (schedules.length === 0) {
    return <p className="text-xs text-brand-gray py-2">오늘 일정이 없습니다.</p>;
  }

  return (
    <>
      {schedules.map((s) => {
        const isLeave = s.category === "leave";
        const isDealer = s.category === "dealer";
        const isInternal = s.category === "internal";
        const isPersonal = s.category === "personal";

        const subParts: string[] = [];
        if (isDealer && s.instructor) subParts.push(`진행자 ${s.instructor}`);
        if (isInternal && s.target_audience) subParts.push(`대상자 ${s.target_audience}`);
        if (isPersonal && s.location) subParts.push(s.location);
        if (isLeave) subParts.push("월차");
        if (s.is_all_day) subParts.push("종일");
        else subParts.push(`${formatTime(s.start_at)} - ${formatTime(s.end_at)}`);

        let customStyle: React.CSSProperties | undefined;
        let colorClass = "";
        const textColorClass = "";

        if (s.instructor_color) {
          const rgb = parseHexColor(s.instructor_color);
          if (rgb) {
            customStyle = {
              borderColor: `rgb(${rgb.r} ${rgb.g} ${rgb.b})`,
              backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
            };
            colorClass = "border-l-4";
          }
        } else {
          colorClass =
            s.category === "dealer"
              ? "border-blue-500 bg-blue-50 border-l-4"
              : s.category === "internal"
              ? "border-purple-500 bg-purple-50 border-l-4"
              : s.category === "personal"
              ? "border-emerald-500 bg-emerald-50 border-l-4"
              : s.category === "leave"
              ? "border-amber-500 bg-amber-50 border-l-4"
              : "border-slate-200 bg-slate-50 border-l-4";
        }

        const deleted = s.is_soft_deleted;
        const avatarSrc = isLeave ? (s.target_avatar_url ?? "") : (s.creator_avatar_url ?? "");
        const avatarName = isLeave
          ? (s.target_full_name || s.manager_name || s.title)
          : (s.creator_full_name || s.title);

        return (
          <button
            key={s.id}
            type="button"
            draggable={isAdmin}
            onDragStart={
              isAdmin
                ? (e) => {
                    const payload = JSON.stringify({
                      id: s.id,
                      start_at: s.start_at,
                      end_at: s.end_at,
                      is_all_day: s.is_all_day,
                    });
                    e.dataTransfer.setData("application/json", payload);
                    e.dataTransfer.setData("text/plain", payload);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.dropEffect = "move";
                  }
                : undefined
            }
            style={customStyle}
            className={`w-full text-left p-2.5 rounded-lg border ${colorClass} ${textColorClass} ${
              isAdmin ? "cursor-grab active:cursor-grabbing" : ""
            } ${deleted ? "opacity-60" : ""}`}
            onClick={() => onSelect(s)}
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-white shadow-sm shrink-0">
                <AvatarImage src={avatarSrc} />
                <AvatarFallback className="bg-slate-200 text-slate-600 text-[10px] font-bold">
                  {avatarName?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold truncate ${
                      deleted ? "text-slate-400 line-through" : "text-brand-black"
                    }`}
                  >
                    {isLeave ? (
                      <>
                        <span>[월차]</span>
                        <br />
                        <span>{s.target_full_name || s.manager_name || s.title}</span>
                      </>
                    ) : isDealer ? (
                      `${s.title}${s.instructor ? ` / ${s.instructor}` : ""} / ${formatTime(s.start_at)}`
                    ) : (
                      `${s.title} / ${formatTime(s.start_at)}`
                    )}
                  </p>
                  {!isLeave && !s.is_all_day && (
                    <span className="text-[10px] text-brand-gray font-medium shrink-0 ml-2">
                      {formatTime(s.start_at)}
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className={`text-[11px] mt-0.5 line-clamp-1 ${deleted ? "text-slate-400 line-through" : "text-slate-500"}`}>
                    {s.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </>
  );
}
