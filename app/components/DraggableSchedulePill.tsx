"use client";

type ScheduleItem = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category?: string;
};

const CATEGORY_CLASSES: Record<string, string> = {
  dealer: "border-blue-500 bg-blue-50 text-blue-800",
  internal: "border-purple-500 bg-purple-50 text-purple-800",
  personal: "border-emerald-500 bg-emerald-50 text-emerald-800",
  leave: "border-amber-500 bg-amber-50 text-amber-800",
  etc: "border-slate-300 bg-slate-50 text-slate-700",
};

export default function DraggableSchedulePill({
  schedule,
  isAdmin,
  className = "text-[10px] p-1.5 border-l-2 rounded truncate",
  onPillClick,
}: {
  schedule: ScheduleItem;
  isAdmin: boolean;
  className?: string;
  onPillClick?: () => void;
}) {
  const colorClass =
    (schedule.category && CATEGORY_CLASSES[schedule.category]) ||
    CATEGORY_CLASSES.etc;
  const baseClass = `${className} ${colorClass}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPillClick?.();
  };

  const clickableClass = onPillClick ? " cursor-pointer" : "";

  if (!isAdmin) {
    return (
      <div className={`${baseClass}${clickableClass}`} onClick={handleClick} role="button" tabIndex={0}>
        {schedule.title}
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
      className={`${baseClass}${clickableClass} cursor-grab active:cursor-grabbing`}
    >
      {schedule.title}
    </div>
  );
}
