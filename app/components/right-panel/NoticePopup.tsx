"use client";

import { useState, useCallback, useEffect } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import type { NoticeItem } from "./types";

type ReadItem = { profile_id: string; full_name: string | null; read_at: string };

type Props = {
  notice: NoticeItem;
  isAdmin: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function NoticePopup({ notice, isAdmin, onClose, onSaved }: Props) {
  const [mode, setMode] = useState<"view" | "edit" | "create">(
    notice ? "view" : isAdmin ? "create" : "view"
  );
  const [title, setTitle] = useState(notice?.title ?? "");
  const [body, setBody] = useState(notice?.body ?? "");
  const [imageUrl, setImageUrl] = useState(notice?.image_url ?? "");
  const [reads, setReads] = useState<ReadItem[]>([]);
  const [readDropdown, setReadDropdown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const noticeId = notice?.id;

  const loadReads = useCallback(async () => {
    if (!noticeId) return;
    const res = await fetch(`/api/notices/${noticeId}/reads`);
    const data = await res.json() as { reads?: ReadItem[] };
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
      const res = await fetch("/api/notices/upload", { method: "POST", body: form });
      const data = await res.json() as { url?: string; message?: string };
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
      const payload = {
        title: title.trim(),
        body: body.trim() || null,
        imageUrl: imageUrl || null,
      };
      if (mode === "create") {
        const res = await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { message?: string };
        if (!res.ok) { setError(data.message ?? "저장에 실패했습니다."); return; }
        onSaved();
        return;
      }
      if (mode === "edit" && noticeId) {
        const res = await fetch(`/api/notices/${noticeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json() as { message?: string };
        if (!res.ok) { setError(data.message ?? "수정에 실패했습니다."); return; }
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-black">
              {showForm ? (mode === "create" ? "공지 작성" : "공지 수정") : "공지사항"}
            </h2>
            <EclipseButton
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="닫기"
              className="!h-8 !w-8 !min-w-0 !p-0"
            >
              ×
            </EclipseButton>
          </div>

          {error && (
            <div className="mb-3 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
              {error}
            </div>
          )}

          {showForm ? (
            <>
              <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 focus:ring-2 focus:ring-primary/30"
                placeholder="제목"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">본문</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 resize-none focus:ring-2 focus:ring-primary/30"
                rows={4}
                placeholder="내용"
              />
              <label className="block text-sm font-medium text-slate-700 mb-1">이미지 첨부</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                disabled={uploading}
                className="mb-2 block w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-sm"
              />
              {uploading && <p className="text-xs text-brand-gray mb-2">업로드 중...</p>}
              {imageUrl && (
                <div className="mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="첨부" className="max-h-40 rounded-lg border border-slate-200" />
                  <EclipseButton
                    type="button"
                    variant="destructive"
                    size="sm"
                    text="이미지 제거"
                    onClick={() => setImageUrl("")}
                    className="mt-1"
                  />
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <EclipseButton
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !title.trim()}
                  isLoading={saving}
                  text={saving ? "저장 중..." : "저장"}
                  variant="primary"
                  className="flex-1"
                />
                <EclipseButton
                  type="button"
                  variant="outline"
                  text="취소"
                  onClick={() => (notice ? setMode("view") : onClose())}
                />
              </div>
            </>
          ) : (
            <>
              {notice && (
                <>
                  <h3 className="text-base font-semibold text-brand-black mb-2">{notice.title}</h3>
                  <div className="text-sm text-slate-700 whitespace-pre-wrap mb-4">
                    {notice.body || "내용 없음"}
                  </div>
                  {notice.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={notice.image_url}
                      alt="첨부"
                      className="mb-4 max-h-48 rounded-lg border border-slate-200 w-full object-cover"
                    />
                  )}

                  {/* 확인한 사람 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-xs font-bold text-slate-500 uppercase">확인한 사람</p>
                      {reads.length > 0 && (
                        <EclipseButton
                          type="button"
                          variant="ghost"
                          size="sm"
                          text={readDropdown ? "접기" : "목록 보기"}
                          onClick={() => setReadDropdown((v) => !v)}
                          className="!normal-case !tracking-normal text-xs"
                        />
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
                            {r.full_name ?? "이름 없음"} · {new Date(r.read_at).toLocaleString("ko-KR")}
                          </div>
                        </div>
                      ))}
                    </div>
                    {readDropdown && reads.length > 0 && (
                      <div className="mt-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1" role="list">
                        {reads.map((r) => (
                          <div key={r.profile_id}>
                            {r.full_name ?? "이름 없음"} · {new Date(r.read_at).toLocaleString("ko-KR")}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <EclipseButton type="button" variant="outline" text="확인했어요" onClick={handleConfirmRead} />
                    {isAdmin && (
                      <EclipseButton type="button" variant="ghost" text="수정" onClick={() => setMode("edit")} />
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
