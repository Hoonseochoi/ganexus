"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import type { MemoItem } from "./types";
import { formatDateTime } from "./types";

type Props = {
  memos: MemoItem[];
  loading: boolean;
  memoContent: string;
  sending: boolean;
  error: string | null;
  isAdmin?: boolean;
  currentUserFullName?: string | null;
  onContentChange: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  onDelete?: (id: string) => void;
  onEditSave?: (id: string, content: string) => void;
  editingId?: string | null;
  editingContent?: string;
  onEditStart?: (id: string, content: string) => void;
  onEditCancel?: () => void;
  onEditContentChange?: (v: string) => void;
  deletingId?: string | null;
};

export function MemoSection({
  memos,
  loading,
  memoContent,
  sending,
  error,
  isAdmin,
  currentUserFullName,
  onContentChange,
  onSubmit,
  onDelete,
  onEditSave,
  editingId,
  editingContent,
  onEditStart,
  onEditCancel,
  onEditContentChange,
  deletingId,
}: Props) {
  // 로컬 draft로 키입력마다 부모 리렌더 방지 (300ms 디바운스로 부모에 전파)
  const [draft, setDraft] = useState(memoContent);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 부모가 제출 후 내용 초기화(memoContent → "")하면 draft도 초기화
  useEffect(() => {
    if (!memoContent) setDraft("");
  }, [memoContent]);

  const handleDraftChange = (v: string) => {
    setDraft(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onContentChange(v), 300);
  };

  return (
    <>
      <h3 className="text-base font-bold mb-3 text-brand-black">메모</h3>
      {error && (
        <div className="mb-2 rounded-lg border border-rose-500/40 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-700">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="mb-3">
        <textarea
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          placeholder="메모를 입력하세요..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          rows={2}
          disabled={sending}
        />
        <EclipseButton
          type="submit"
          disabled={sending || !memoContent.trim()}
          isLoading={sending}
          text={sending ? "저장 중..." : "작성"}
          variant="primary"
          className="mt-1 w-full"
        />
      </form>
      <div className="space-y-2 overflow-y-auto min-h-0">
        {loading ? (
          <p className="text-xs text-brand-gray">불러오는 중...</p>
        ) : (
          memos.map((m) => {
            const isOwn = !!currentUserFullName && m.author_name === currentUserFullName;
            const isEditingThis = editingId === m.id;
            return (
              <div key={m.id} className="p-2.5 rounded-lg border border-slate-100 bg-white text-sm">
                {isEditingThis && onEditContentChange && onEditSave && onEditCancel ? (
                  <div>
                    <textarea
                      value={editingContent ?? ""}
                      onChange={(e) => onEditContentChange(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex gap-1.5 mt-1.5">
                      <EclipseButton
                        type="button"
                        variant="primary"
                        size="sm"
                        text="저장"
                        onClick={() => onEditSave(m.id, editingContent ?? "")}
                        disabled={!editingContent?.trim()}
                      />
                      <EclipseButton
                        type="button"
                        variant="outline"
                        size="sm"
                        text="취소"
                        onClick={onEditCancel}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-800 whitespace-pre-wrap">{m.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-[10px] text-brand-gray">
                        {m.author_name ?? "알 수 없음"} · {formatDateTime(m.created_at)}
                      </p>
                      {(isOwn || isAdmin) && (
                        <div className="flex gap-2">
                          {onEditStart && (
                            <button
                              type="button"
                              onClick={() => onEditStart(m.id, m.content)}
                              className="text-[10px] text-brand-gray hover:text-slate-600 underline"
                            >
                              수정
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(m.id)}
                              disabled={deletingId === m.id}
                              className="text-[10px] text-rose-500 hover:text-rose-700 underline disabled:opacity-50"
                            >
                              삭제
                            </button>
                          )}
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
    </>
  );
}
