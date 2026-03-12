"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

type DragPayload = {
  id: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
};

type Props = {
  dateISO: string | null;
  isEmpty: boolean;
  className: string;
  children: React.ReactNode;
};

export default function CalendarCellDropZone({
  dateISO,
  isEmpty,
  className,
  children,
}: Props) {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (isEmpty || !dateISO) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setIsDragOver(true);
    },
    [isEmpty, dateISO],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      if (isEmpty || !dateISO) return;
      e.preventDefault();
      setIsDragOver(false);
      let raw = e.dataTransfer.getData("application/json");
      if (!raw) raw = e.dataTransfer.getData("text/plain");
      if (!raw) return;
      let payload: DragPayload;
      try {
        payload = JSON.parse(raw) as DragPayload;
      } catch {
        return;
      }
      if (!payload.id || !payload.start_at || !payload.end_at) return;

      // 로컬 날짜 기준으로 변환 (UTC만 쓰면 타임존에 따라 하루 밀림)
      const [y, m, d] = dateISO.slice(0, 10).split("-").map(Number);
      let newStartAt: string;
      let newEndAt: string;

      if (payload.is_all_day) {
        const localStart = new Date(y, m - 1, d, 0, 0, 0, 0);
        const localEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
        newStartAt = localStart.toISOString();
        newEndAt = localEnd.toISOString();
      } else {
        const origStart = new Date(payload.start_at);
        const origEnd = new Date(payload.end_at);
        const localStart = new Date(
          y,
          m - 1,
          d,
          origStart.getHours(),
          origStart.getMinutes(),
          origStart.getSeconds(),
          origStart.getMilliseconds(),
        );
        const localEnd = new Date(
          y,
          m - 1,
          d,
          origEnd.getHours(),
          origEnd.getMinutes(),
          origEnd.getSeconds(),
          origEnd.getMilliseconds(),
        );
        newStartAt = localStart.toISOString();
        newEndAt = localEnd.toISOString();
      }

      const res = await fetch(`/api/schedules/${payload.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startAt: newStartAt,
          endAt: newEndAt,
        }),
      });

      if (res.ok) router.refresh();
    },
    [dateISO, isEmpty, router],
  );

  if (isEmpty || !dateISO) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`${className} ${isDragOver ? "ring-2 ring-primary bg-primary/10" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label={`${dateISO.slice(0, 10)}로 일정 놓기`}
    >
      {children}
    </div>
  );
}
