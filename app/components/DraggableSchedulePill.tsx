"use client";

type ScheduleItem = {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
};

export default function DraggableSchedulePill({
  schedule,
  isAdmin,
  className = "text-[10px] p-1.5 bg-primary/5 border-l-2 border-primary text-slate-700 rounded truncate",
}: {
  schedule: ScheduleItem;
  isAdmin: boolean;
  className?: string;
}) {
  if (!isAdmin) {
    return <div className={className}>{schedule.title}</div>;
  }
  return (
    <div
      draggable
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
      className={`${className} cursor-grab active:cursor-grabbing`}
    >
      {schedule.title}
    </div>
  );
}
