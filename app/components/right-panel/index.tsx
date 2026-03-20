"use client";

import { useEffect, useState, useCallback, FormEvent, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { ScheduleDetailPopup } from "./ScheduleDetailPopup";
import { NoticePopup } from "./NoticePopup";
import { ScheduleList } from "./ScheduleList";
import { MemoSection } from "./MemoSection";
import type { ScheduleItem, MemoItem, NoticeItem } from "./types";
import { formatDateLabel } from "./types";

export type { ScheduleItem };

const RightPanel = memo(RightPanelBase);
export default RightPanel;

function RightPanelBase({
  todaySchedules,
  selectedDateStr,
  isAdmin,
  canAddSchedule,
  currentUserFullName,
}: {
  todaySchedules: ScheduleItem[];
  selectedDateStr?: string | null;
  isAdmin: boolean;
  canAddSchedule?: boolean;
  currentUserFullName?: string | null;
}) {
  const [notice, setNotice] = useState<NoticeItem>(null);
  const [readByMe, setReadByMe] = useState(false);
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [memoContent, setMemoContent] = useState("");
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [loadingMemos, setLoadingMemos] = useState(true);
  const [sendingMemo, setSendingMemo] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const router = useRouter();

  const todayStr = useMemo(() => {
    const koreaString = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
    return new Date(koreaString).toISOString().slice(0, 10);
  }, []);

  const fetchNotice = useCallback(async () => {
    setLoadingNotice(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json() as { notice?: NoticeItem; readByMe?: boolean };
      if (res.ok) {
        setNotice(data.notice ?? null);
        setReadByMe(data.readByMe ?? false);
      }
    } catch {
      setNotice(null);
      setReadByMe(false);
    } finally {
      setLoadingNotice(false);
    }
  }, []);

  const fetchMemos = useCallback(async () => {
    setLoadingMemos(true);
    try {
      const res = await fetch(`/api/memos?date=${todayStr}`);
      const data = await res.json() as { memos?: MemoItem[] };
      if (res.ok) setMemos(data.memos ?? []);
    } catch {
      setMemos([]);
    } finally {
      setLoadingMemos(false);
    }
  }, [todayStr]);

  useEffect(() => { void fetchNotice(); }, [fetchNotice]);
  useEffect(() => { void fetchMemos(); }, [fetchMemos]);

  const handleMemoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!memoContent.trim() || sendingMemo) return;
    setError(null);
    setSendingMemo(true);
    try {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: memoContent.trim() }),
      });
      const data = await res.json() as { message?: string };
      if (!res.ok) { setError(data.message ?? "메모 저장에 실패했습니다."); return; }
      setMemoContent("");
      void fetchMemos();
    } catch {
      setError("네트워크 오류로 메모 저장에 실패했습니다.");
    } finally {
      setSendingMemo(false);
    }
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col h-full overflow-y-auto">

        {/* 일정 추가 버튼 + 공지 */}
        <div className="mb-4 flex flex-col gap-2">
          {canAddSchedule && (
            <EclipseButton
              type="button"
              variant="primary"
              size="sm"
              text="일정 추가하기"
              className="w-full"
              onClick={() => router.push("/admin/schedules")}
            />
          )}
          <div className="flex flex-col min-w-0">
            <button
              type="button"
              onClick={() => setPopupOpen(true)}
              className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">공지사항</p>
              {loadingNotice ? (
                <p className="text-xs text-slate-500">불러오는 중...</p>
              ) : notice ? (
                <p className="text-sm font-medium text-brand-black line-clamp-2">{notice.title}</p>
              ) : (
                <p className="text-xs text-slate-500">
                  {isAdmin ? "클릭하여 공지 작성" : "등록된 공지가 없습니다."}
                </p>
              )}
            </button>
            {notice && readByMe && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <span aria-hidden>✓</span> 읽음
              </p>
            )}
          </div>
        </div>

        {/* 선택 날짜(오늘) 일정 */}
        <h3 className="text-base font-bold mb-3 text-brand-black">
          {selectedDateStr ? `${formatDateLabel(selectedDateStr)} 일정` : "오늘의 일정"}
        </h3>
        <div className="mb-6 space-y-2 flex-shrink-0">
          <ScheduleList
            schedules={todaySchedules}
            isAdmin={isAdmin}
            onSelect={setSelectedSchedule}
          />
        </div>

        {/* 메모 */}
        <MemoSection
          memos={memos}
          loading={loadingMemos}
          memoContent={memoContent}
          sending={sendingMemo}
          error={error}
          onContentChange={setMemoContent}
          onSubmit={handleMemoSubmit}
        />
      </div>

      {popupOpen && (
        <NoticePopup
          notice={notice}
          isAdmin={isAdmin}
          onClose={() => setPopupOpen(false)}
          onSaved={() => { void fetchNotice(); setPopupOpen(false); }}
        />
      )}
      {selectedSchedule && (
        <ScheduleDetailPopup
          schedule={selectedSchedule}
          isAdmin={isAdmin}
          currentUserFullName={currentUserFullName}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </aside>
  );
}
