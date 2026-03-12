"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import Link from "next/link";

type ScheduleItem = {
  id: string;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  category: string;
};

type MemoItem = {
  id: string;
  content: string;
  author_name: string | null;
  created_at: string;
};

type NoticeItem = {
  id: string;
  title: string;
  body: string | null;
  image_url: string | null;
  created_at: string;
} | null;

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function RightPanel({
  todaySchedules,
  isAdmin,
}: {
  todaySchedules: ScheduleItem[];
  isAdmin: boolean;
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

  const todayStr = new Date().toISOString().slice(0, 10);

  const fetchNotice = useCallback(async () => {
    setLoadingNotice(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
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
      const data = await res.json();
      if (res.ok) setMemos(data.memos ?? []);
    } catch {
      setMemos([]);
    } finally {
      setLoadingMemos(false);
    }
  }, [todayStr]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  useEffect(() => {
    fetchMemos();
  }, [fetchMemos]);

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
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "메모 저장에 실패했습니다.");
        return;
      }
      setMemoContent("");
      fetchMemos();
    } catch {
      setError("네트워크 오류로 메모 저장에 실패했습니다.");
    } finally {
      setSendingMemo(false);
    }
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
      <div className="p-4 flex flex-col h-full overflow-y-auto">
        {/* 우측 상단: 일정추가 위, 공지사항 아래 (세로 배치) */}
        <div className="mb-4 flex flex-col gap-2">
          {isAdmin && (
            <Link
              href="/admin/schedules"
              className="w-full text-center py-1.5 px-2.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
            >
              일정추가
            </Link>
          )}
          <div className="flex flex-col min-w-0">
            <button
              type="button"
              onClick={() => setPopupOpen(true)}
              className="w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                공지사항
              </p>
              {loadingNotice ? (
                <p className="text-xs text-slate-500">불러오는 중...</p>
              ) : notice ? (
                <p className="text-sm font-medium text-brand-black line-clamp-2">
                  {notice.title}
                </p>
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

        {/* 오늘의 일정 */}
        <h3 className="text-base font-bold mb-3 text-brand-black">
          오늘의 일정
        </h3>
        <div className="mb-6 space-y-2 flex-shrink-0">
          {todaySchedules.length === 0 ? (
            <p className="text-xs text-brand-gray py-2">
              오늘 일정이 없습니다.
            </p>
          ) : (
            todaySchedules.map((s) => (
              <div
                key={s.id}
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
                className={`p-3 rounded-lg border border-slate-100 bg-primary/5 border-l-4 border-primary ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                <p className="text-sm font-semibold text-brand-black">
                  {s.title}
                </p>
                <p className="text-xs text-brand-gray mt-0.5">
                  {s.is_all_day
                    ? "종일"
                    : `${formatTime(s.start_at)} - ${formatTime(s.end_at)}`}
                </p>
                {s.description && (
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {s.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* 메모 */}
        <h3 className="text-base font-bold mb-3 text-brand-black">메모</h3>
        {error && (
          <div className="mb-2 rounded-lg border border-rose-500/40 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-700">
            {error}
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
          <button
            type="submit"
            disabled={sendingMemo || !memoContent.trim()}
            className="mt-1 w-full py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingMemo ? "저장 중..." : "작성"}
          </button>
        </form>
        <div className="space-y-2 overflow-y-auto min-h-0">
          {loadingMemos ? (
            <p className="text-xs text-brand-gray">불러오는 중...</p>
          ) : (
            memos.map((m) => (
              <div
                key={m.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-white text-sm"
              >
                <p className="text-slate-800">{m.content}</p>
                <p className="text-[10px] text-brand-gray mt-1">
                  {m.author_name ?? "알 수 없음"} · {formatDateTime(m.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {popupOpen && (
        <NoticePopup
          notice={notice}
          isAdmin={isAdmin}
          onClose={() => setPopupOpen(false)}
          onSaved={() => {
            fetchNotice();
            setPopupOpen(false);
          }}
        />
      )}
    </aside>
  );
}

function NoticePopup({
  notice,
  isAdmin,
  onClose,
  onSaved,
}: {
  notice: NoticeItem;
  isAdmin: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "create">(
    notice ? "view" : isAdmin ? "create" : "view",
  );
  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [imageUrl, setImageUrl] = useState(notice?.image_url ?? "");
  const [reads, setReads] = useState<{ profile_id: string; full_name: string | null; read_at: string }[]>([]);
  const [readDropdown, setReadDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noticeId = notice?.id;

  const loadReads = useCallback(async () => {
    if (!noticeId) return;
    const res = await fetch(`/api/notices/${noticeId}/reads`);
    const data = await res.json();
    if (res.ok) setReads(data.reads ?? []);
  }, [noticeId]);

  useEffect(() => {
    if (notice) {
      setTitle(notice.title);
      setBody(notice.body ?? "");
      setImageUrl(notice.image_url ?? "");
      setMode("view");
    } else if (isAdmin) {
      setMode("create");
      setTitle("");
      setBody("");
      setImageUrl("");
    }
  }, [notice, isAdmin]);

  useEffect(() => {
    if (noticeId && mode === "view") loadReads();
  }, [noticeId, mode, loadReads]);

  const handleConfirmRead = async () => {
    if (!noticeId) return;
    try {
      await fetch(`/api/notices/${noticeId}/read`, { method: "POST" });
      loadReads();
    } catch {
      // ignore
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/notices/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "이미지 업로드에 실패했습니다.");
        return;
      }
      setImageUrl(data.url ?? "");
    } catch {
      setError("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            body: body.trim() || null,
            imageUrl: imageUrl || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? "저장에 실패했습니다.");
          return;
        }
        onSaved();
        return;
      }
      if (mode === "edit" && noticeId) {
        const res = await fetch(`/api/notices/${noticeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            body: body.trim() || null,
            imageUrl: imageUrl || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? "수정에 실패했습니다.");
          return;
        }
        onSaved();
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const showForm = mode === "edit" || mode === "create";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-black">
              {showForm ? (mode === "create" ? "공지 작성" : "공지 수정") : "공지사항"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="닫기"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          {showForm ? (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 focus:ring-2 focus:ring-primary/30"
                placeholder="제목"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">
                본문
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 resize-none focus:ring-2 focus:ring-primary/30"
                rows={4}
                placeholder="내용"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이미지 첨부
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                disabled={uploading}
                className="mb-2 block w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-sm"
              />
              {uploading && (
                <p className="text-xs text-brand-gray mb-2">업로드 중...</p>
              )}
              {imageUrl && (
                <div className="mb-3">
                  <img
                    src={imageUrl}
                    alt="첨부"
                    className="max-h-40 rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="mt-1 text-xs text-rose-600 hover:underline"
                  >
                    이미지 제거
                  </button>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  className="flex-1 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
                <button
                  type="button"
                  onClick={() => (notice ? setMode("view") : onClose())}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-700"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              {notice && (
                <>
                  <h3 className="text-base font-semibold text-brand-black mb-2">
                    {notice.title}
                  </h3>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap mb-4">
                    {notice.body || "내용 없음"}
                  </div>
                  {notice.image_url && (
                    <img
                      src={notice.image_url}
                      alt="첨부"
                      className="mb-4 max-h-48 rounded-lg border border-slate-200 w-full object-cover"
                    />
                  )}

                  {/* 확인한 사람: 프로필 아이콘, 호버 시 이름·시각, 클릭 시 드롭다운 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase">
                        확인한 사람
                      </p>
                      {reads.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setReadDropdown((v) => !v)}
                          className="text-xs text-primary hover:underline"
                        >
                          {readDropdown ? "접기" : "목록 보기"}
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {reads.map((r) => (
                        <div
                          key={r.profile_id}
                          className="relative group"
                          title={`${r.full_name ?? "이름 없음"} · ${new Date(r.read_at).toLocaleString("ko-KR")}`}
                        >
                          <span className="inline-flex w-8 h-8 rounded-full bg-primary/20 text-primary items-center justify-center text-xs font-bold border-2 border-white shadow cursor-default">
                            {(r.full_name ?? "?")[0]}
                          </span>
                          <div className="hidden group-hover:block absolute left-0 top-full mt-1 z-20 py-1.5 px-2 rounded-lg bg-slate-800 text-white text-xs shadow whitespace-nowrap">
                            {r.full_name ?? "이름 없음"} ·{" "}
                            {new Date(r.read_at).toLocaleString("ko-KR")}
                          </div>
                        </div>
                      ))}
                    </div>
                    {readDropdown && reads.length > 0 && (
                      <div
                        className="mt-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1"
                        role="list"
                      >
                        {reads.map((r) => (
                          <div key={r.profile_id}>
                            {r.full_name ?? "이름 없음"} ·{" "}
                            {new Date(r.read_at).toLocaleString("ko-KR")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmRead}
                      className="py-2 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5"
                    >
                      확인했어요
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setMode("edit")}
                        className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
                      >
                        수정
                      </button>
                    )}
                  </div>
                </>
              )}
              {!notice && !isAdmin && (
                <p className="text-sm text-brand-gray">등록된 공지가 없습니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
