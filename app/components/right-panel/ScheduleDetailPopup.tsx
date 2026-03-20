"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { ScheduleAddScheduler } from "@/app/admin/schedules/_components/ScheduleAddScheduler";
import { notifyCalendarMonthDataChanged } from "@/src/lib/calendar/month-client-cache";
import type { ScheduleItem, ScheduleEditLogItem, MemoItem, ManagersApiResponse } from "./types";
import { formatDateTime } from "./types";

type Props = {
  schedule: ScheduleItem;
  onClose: () => void;
  isAdmin?: boolean;
  currentUserFullName?: string | null;
  showMemos?: boolean;
  memoDate?: string;
};

export function ScheduleDetailPopup({
  schedule,
  onClose,
  isAdmin,
  currentUserFullName,
  showMemos,
  memoDate,
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(schedule.title);
  const [description, setDescription] = useState(schedule.description ?? "");
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<ScheduleEditLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [instructors, setInstructors] = useState<
    { id: string; name: string; instructor_color: string | null }[]
  >([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [memoContent, setMemoContent] = useState("");
  const [loadingMemos, setLoadingMemos] = useState(false);
  const [sendingMemo, setSendingMemo] = useState(false);
  const [memoError, setMemoError] = useState<string | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingMemoContent, setEditingMemoContent] = useState("");
  const [deletingMemoId, setDeletingMemoId] = useState<string | null>(null);

  const isDealer = schedule.category === "dealer";
  const isInternal = schedule.category === "internal";
  const isPersonal = schedule.category === "personal";
  const isLeave = schedule.category === "leave";

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch(`/api/schedules/${schedule.id}/logs`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      const data = await res.json().catch(() => null) as { logs?: ScheduleEditLogItem[] } | null;
      if (res.ok && data && typeof data === "object") {
        setLogs(data.logs ?? []);
      }
    } finally {
      setLoadingLogs(false);
    }
  }, [schedule.id]);

  useEffect(() => {
    setEditing(false);
    setTitle(schedule.title);
    setDescription(schedule.description ?? "");
    void loadLogs();
  }, [schedule.id, loadLogs]);

  // 편집 모드에서 교육자 목록 로딩
  useEffect(() => {
    if (!editing) return;
    let cancelled = false;
    const load = async () => {
      setLoadingInstructors(true);
      try {
        const res = await fetch("/api/admin/managers");
        const data = await res.json().catch(() => ({})) as ManagersApiResponse;
        if (!cancelled && res.ok && Array.isArray(data.managers)) {
          setInstructors(
            data.managers
              .filter((m) => m.is_instructor)
              .map((m) => ({
                id: m.id,
                name: m.name,
                instructor_color: m.instructor_color ?? null,
              }))
          );
        }
      } finally {
        if (!cancelled) setLoadingInstructors(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [editing]);

  const fetchMemos = useCallback(async () => {
    if (!showMemos || !memoDate) return;
    setLoadingMemos(true);
    try {
      const res = await fetch(`/api/memos?date=${memoDate}`);
      const data = await res.json() as { memos?: MemoItem[] };
      if (res.ok) setMemos(data.memos ?? []);
    } catch {
      setMemos([]);
    } finally {
      setLoadingMemos(false);
    }
  }, [showMemos, memoDate]);

  useEffect(() => { void fetchMemos(); }, [fetchMemos]);

  const handleMemoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!memoContent.trim() || sendingMemo) return;
    setMemoError(null);
    setSendingMemo(true);
    try {
      const res = await fetch("/api/memos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: memoContent.trim() }),
      });
      const data = await res.json() as { message?: string };
      if (!res.ok) { setMemoError(data.message ?? "메모 저장에 실패했습니다."); return; }
      setMemoContent("");
      void fetchMemos();
    } catch {
      setMemoError("네트워크 오류로 메모 저장에 실패했습니다.");
    } finally {
      setSendingMemo(false);
    }
  };

  const handleMemoDelete = async (memoId: string) => {
    if (!window.confirm("메모를 삭제하시겠습니까?")) return;
    setDeletingMemoId(memoId);
    try {
      const res = await fetch(`/api/memos/${memoId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string };
        alert(data.message ?? "삭제에 실패했습니다.");
        return;
      }
      void fetchMemos();
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setDeletingMemoId(null);
    }
  };

  const handleMemoEditSave = async (memoId: string) => {
    if (!editingMemoContent.trim()) return;
    try {
      const res = await fetch(`/api/memos/${memoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingMemoContent.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string };
        alert(data.message ?? "수정에 실패했습니다.");
        return;
      }
      setEditingMemoId(null);
      setEditingMemoContent("");
      void fetchMemos();
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  const canDelete =
    !!schedule.creator_full_name &&
    !!currentUserFullName &&
    schedule.creator_full_name === currentUserFullName;

  const handleDelete = async () => {
    if (!isAdmin && !canDelete) { alert("일정 삭제 권한이 없습니다."); return; }
    if (!window.confirm("해당 일정을 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/schedules/${schedule.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({})) as { message?: string };
      if (!res.ok) { alert(data.message ?? "일정 삭제에 실패했습니다."); return; }
      notifyCalendarMonthDataChanged();
      router.refresh();
      onClose();
    } catch {
      alert("네트워크 오류로 일정 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const formatLogValue = (value: unknown) => {
    if (value === null || value === undefined) return "없음";
    if (typeof value === "string" && value.trim() === "") return "없음";
    return String(value);
  };

  void title;
  void saving;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-base font-bold text-brand-black">
            {editing ? "일정 수정" : schedule.title}
          </h2>
          <div className="flex items-center gap-2">
            {(isAdmin || canDelete) && !editing && (
              <EclipseButton
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                aria-label="일정 삭제"
                className="!h-8 !w-8 !min-w-0 !p-0"
                disabled={deleting}
                isLoading={deleting}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" aria-hidden>
                  <path
                    d="M9 3h6a1 1 0 0 1 .96.73L16.78 5H20a1 1 0 1 1 0 2h-1.1l-.76 11.05A2 2 0 0 1 16.16 20H7.84a2 2 0 0 1-1.98-1.95L5.1 7H4a1 1 0 0 1 0-2h3.22l.82-1.27A1 1 0 0 1 9 3Zm6.9 4H8.1l.72 10.5a0 0 0 0 0 0 0h6.36a0 0 0 0 0 0 0L15.9 7ZM10 9a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1Zm4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1Z"
                    fill="currentColor"
                  />
                </svg>
              </EclipseButton>
            )}
            {!editing && (
              <EclipseButton
                type="button"
                variant="outline"
                size="sm"
                text="편집"
                onClick={() => setEditing(true)}
                className="!text-xs"
              />
            )}
            <EclipseButton
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="일정 상세 닫기"
              className="!h-8 !w-8 !min-w-0 !p-0"
            >
              ×
            </EclipseButton>
          </div>
        </div>

        {/* 본문: 편집 or 상세 */}
        {editing ? (
          <div className="p-4">
            {loadingInstructors && (
              <p className="text-xs text-brand-gray mb-2">교육자 정보를 불러오는 중...</p>
            )}
            <ScheduleAddScheduler
              mode="edit"
              userFullName={schedule.creator_full_name ?? "관리자"}
              instructors={instructors}
              initialSchedule={schedule}
              submitLabel="수정 완료"
              onSuccess={async () => {
                notifyCalendarMonthDataChanged();
                await router.refresh();
                setEditing(false);
                onClose();
              }}
            />
          </div>
        ) : (
          <div className="p-5">
            <p className="text-xs text-brand-gray mb-3">
              {formatDateTime(schedule.start_at)}
              {schedule.is_all_day ? " · 종일" : <> ~ {formatDateTime(schedule.end_at)}</>}
            </p>
            <div className="space-y-1.5 text-sm text-slate-800">
              {isDealer && (
                <>
                  {schedule.instructor && <p><span className="text-brand-gray text-xs mr-1">교육자</span>{schedule.instructor}</p>}
                  {schedule.location && <p><span className="text-brand-gray text-xs mr-1">장소</span>{schedule.location}</p>}
                </>
              )}
              {isInternal && (
                <>
                  {schedule.target_audience && <p><span className="text-brand-gray text-xs mr-1">대상자</span>{schedule.target_audience}</p>}
                  {schedule.location && <p><span className="text-brand-gray text-xs mr-1">장소</span>{schedule.location}</p>}
                </>
              )}
              {isPersonal && schedule.location && <p><span className="text-brand-gray text-xs mr-1">장소</span>{schedule.location}</p>}
              {isLeave && <p className="text-xs text-amber-700">{schedule.title} 매니저님의 월차 일정입니다.</p>}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-700 whitespace-pre-wrap">
              {description || <span className="text-xs text-brand-gray">설명이 없습니다.</span>}
            </div>
          </div>
        )}

        {/* 수정 이력 */}
        <div className="px-5 pb-5 pt-3 border-t border-slate-100">
          <p className="text-xs font-semibold text-brand-gray mb-1.5">수정 이력</p>
          {loadingLogs ? (
            <p className="text-xs text-brand-gray">불러오는 중...</p>
          ) : logs.length === 0 ? (
            <p className="text-xs text-brand-gray">수정 이력이 없습니다.</p>
          ) : (
            <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {logs.map((log) => (
                <li key={log.id} className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-brand-gray">수정자: {log.modifier_name ?? log.modified_by}</span>
                    <span className="text-[11px] text-brand-gray">
                      {new Date(log.created_at).toLocaleString("ko-KR", {
                        month: "numeric", day: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: false,
                      })}
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5 text-[11px] text-slate-700">
                    {Object.entries(log.changed_fields).map(([field, diff]) => (
                      <p key={field}>
                        <span className="font-semibold">{field}</span>:{" "}
                        {formatLogValue(diff.before)} → {formatLogValue(diff.after)}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 메모 (showMemos 옵션) */}
        {showMemos && (
          <div className="px-5 pb-5 pt-3 border-t border-slate-100">
            <p className="text-xs font-semibold text-brand-gray mb-2">메모</p>
            {memoError && (
              <div className="mb-2 rounded-lg border border-rose-500/40 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-700">
                {memoError}
              </div>
            )}
            <form onSubmit={handleMemoSubmit} className="mb-3">
              <textarea
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                placeholder="메모를 입력하세요..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                rows={2}
                disabled={sendingMemo}
              />
              <EclipseButton
                type="submit"
                disabled={sendingMemo || !memoContent.trim()}
                isLoading={sendingMemo}
                text={sendingMemo ? "저장 중..." : "작성"}
                variant="primary"
                className="mt-1 w-full"
              />
            </form>
            <div className="space-y-2">
              {loadingMemos ? (
                <p className="text-xs text-brand-gray">불러오는 중...</p>
              ) : (
                memos.map((m) => {
                  const isOwn = !!currentUserFullName && m.author_name === currentUserFullName;
                  const isEditingThis = editingMemoId === m.id;
                  return (
                    <div key={m.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-sm">
                      {isEditingThis ? (
                        <div>
                          <textarea
                            value={editingMemoContent}
                            onChange={(e) => setEditingMemoContent(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-1.5 mt-1.5">
                            <EclipseButton type="button" variant="primary" size="sm" text="저장" onClick={() => handleMemoEditSave(m.id)} disabled={!editingMemoContent.trim()} />
                            <EclipseButton type="button" variant="outline" size="sm" text="취소" onClick={() => { setEditingMemoId(null); setEditingMemoContent(""); }} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-800 whitespace-pre-wrap">{m.content}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-brand-gray">
                              {m.author_name ?? "알 수 없음"} · {new Date(m.created_at).toLocaleString("ko-KR")}
                            </p>
                            {(isOwn || isAdmin) && (
                              <div className="flex gap-2">
                                <button type="button" onClick={() => { setEditingMemoId(m.id); setEditingMemoContent(m.content); }} className="text-[10px] text-brand-gray hover:text-slate-600 underline">수정</button>
                                <button type="button" onClick={() => handleMemoDelete(m.id)} disabled={deletingMemoId === m.id} className="text-[10px] text-rose-500 hover:text-rose-700 underline disabled:opacity-50">삭제</button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
