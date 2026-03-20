"use client";

import { Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

type ScheduleItem = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category?: string;
  is_private?: boolean;
  manager_name?: string | null;
  creator_full_name?: string | null;
  creator_avatar_url?: string | null;
  target_full_name?: string | null;
  target_avatar_url?: string | null;
  instructor?: string | null;
  instructor_color?: string | null;
};

const CATEGORY_CLASSES: Record<string, string> = {
  dealer: "border-blue-200 bg-blue-50/80 text-blue-700",
  internal: "border-purple-200 bg-purple-50/80 text-purple-700",
  personal: "border-emerald-200 bg-emerald-50/80 text-emerald-700",
  leave: "border-rose-200 bg-rose-50/80 text-rose-700",
  etc: "border-slate-200 bg-slate-50/80 text-slate-600",
  private: "border-slate-900 bg-slate-900 text-white",
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

export default function DraggableSchedulePill({
  schedule,
  isAdmin,
  className = "text-[9px] leading-none py-1 px-1 border rounded-lg flex items-start gap-1 transition-all",
  onPillClick,
  hideAvatar = false,
}: {
  schedule: ScheduleItem;
  isAdmin: boolean;
  className?: string;
  onPillClick?: () => void;
  hideAvatar?: boolean;
}) {
  let colorClass =
    (schedule.category && CATEGORY_CLASSES[schedule.category]) ||
    CATEGORY_CLASSES.etc;
  let customStyle: React.CSSProperties | undefined;

  // 나만보기 일정: fuchsia 고유 컬러 적용
  if (schedule.is_private) {
    colorClass = CATEGORY_CLASSES.private;
  }

  const rgb = parseHexColor(schedule.instructor_color);
  if (rgb) {
    colorClass = "text-slate-900";
    customStyle = {
      borderColor: `rgb(${rgb.r} ${rgb.g} ${rgb.b})`,
      backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
    };
  }
  const baseClass = `${className} ${colorClass}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPillClick?.();
  };

  const clickableClass = onPillClick ? " cursor-pointer hover:shadow-sm" : "";

  const timeStr = new Date(schedule.start_at).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const isLeave = schedule.category === "leave";
  const displayName = isLeave ? (schedule.target_full_name || schedule.manager_name || schedule.title) : (schedule.creator_full_name || schedule.title);
  const displayAvatar = isLeave ? schedule.target_avatar_url : schedule.creator_avatar_url;

  const content = (
    <>
      {!hideAvatar && (
        <Avatar className="w-4 h-4 text-[8px] border border-white shadow-sm shrink-0">
          <AvatarImage src={displayAvatar || ""} />
          <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
            {displayName?.[0] || "?"}
          </AvatarFallback>
        </Avatar>
      )}
      <span className="line-clamp-2 whitespace-normal flex-1 min-w-0 leading-[1.2]">
        {isLeave ? (
          <span className="font-bold">
            [월차]<br />{displayName}
          </span>
        ) : schedule.category === "dealer" ? (
          <span className="font-semibold">
            {schedule.title}
            {schedule.instructor ? ` / ${schedule.instructor}` : ""}
            {` / ${timeStr}`}
          </span>
        ) : (
          <span className="font-medium">
            {schedule.title} / {schedule.creator_full_name || "작성자"} / {timeStr}
          </span>
        )}
      </span>
      {/* 나만보기: 끝에 노란 자물쇠 */}
      {schedule.is_private && (
        <Lock className="h-2.5 w-2.5 shrink-0 text-yellow-400 self-center" />
      )}
    </>
  );

  if (!isAdmin) {
    return (
      <div className={`${baseClass}${clickableClass}`} style={customStyle} onClick={handleClick} role="button" tabIndex={0}>
        {content}
      </div>
    );
  }

  return (
    <div
      draggable
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onDragStart={(e) => {
        const payload = JSON.stringify({
          id: schedule.id,
          start_at: schedule.start_at,
          end_at: schedule.end_at,
          is_all_day: schedule.is_all_day,
        });
        e.dataTransfer.setData("application/json", payload);
        e.dataTransfer.setData("text/plain", payload);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.dropEffect = "move";
      }}
      style={customStyle}
      className={`${baseClass}${clickableClass} cursor-grab active:cursor-grabbing`}
    >
      {content}
    </div>
  );
}
