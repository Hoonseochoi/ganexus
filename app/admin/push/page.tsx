"use client";

import { useState } from "react";
import { Send, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { AdminPageHeader } from "@/app/admin/_components/AdminPageHeader";
import PushSettingToggle from "@/app/components/ui/PushSettingToggle";

type SendResult = {
  sent: number;
  failed: number;
  sentLogs: string[];
  failedLogs: string[];
};

export default function AdminPushPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [showSentLog, setShowSentLog] = useState(false);
  const [showFailedLog, setShowFailedLog] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    setResult(null);
    setApiError(null);
    setShowSentLog(false);
    setShowFailedLog(false);
    try {
      const res = await fetch("/api/admin/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      const data = await res.json() as SendResult & { error?: string };
      if (!res.ok) {
        setApiError(data.error ?? "발송 중 오류가 발생했습니다.");
        return;
      }
      setResult(data);
      setTitle("");
      setBody("");
    } catch {
      setApiError("네트워크 오류로 발송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-lg mx-auto pt-8 space-y-4">
        <AdminPageHeader
          title="푸시 알림 발송"
          description="지점 전체 멤버에게 알림을 보냅니다"
        />

        {/* 내 알림 수신 설정 */}
        <PushSettingToggle />

        {/* 발송 폼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">알림 작성</p>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="알림 제목을 입력하세요"
              maxLength={50}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">내용</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="알림 내용을 입력하세요"
              rows={4}
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none"
            />
            <p className="text-right text-xs text-slate-300 mt-1">{body.length}/200</p>
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !title.trim() || !body.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 active:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {loading ? "발송 중..." : "전체 발송"}
          </button>
        </div>

        {/* API 오류 */}
        {apiError && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
            {apiError}
          </div>
        )}

        {/* 발송 결과 */}
        {result && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">발송 결과</p>
              <div className="flex gap-3">
                {/* 성공 수 */}
                <button
                  type="button"
                  onClick={() => { setShowSentLog((v) => !v); setShowFailedLog(false); }}
                  disabled={result.sent === 0}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:cursor-default disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-emerald-700">{result.sent}명 성공</span>
                  {result.sent > 0 && (
                    showSentLog
                      ? <ChevronUp className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                      : <ChevronDown className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                  )}
                </button>

                {/* 실패 수 */}
                <button
                  type="button"
                  onClick={() => { setShowFailedLog((v) => !v); setShowSentLog(false); }}
                  disabled={result.failed === 0}
                  className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors disabled:cursor-default disabled:opacity-60"
                >
                  <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm font-bold text-slate-500">{result.failed}명 실패</span>
                  {result.failed > 0 && (
                    showFailedLog
                      ? <ChevronUp className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                      : <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-auto" />
                  )}
                </button>
              </div>
            </div>

            {/* 성공 로그 */}
            {showSentLog && result.sentLogs.length > 0 && (
              <div className="px-5 py-3 border-b border-slate-50">
                <p className="text-[11px] font-semibold text-emerald-600 uppercase mb-2">수신 완료</p>
                <div className="space-y-1.5">
                  {result.sentLogs.map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-sm text-slate-700">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 실패 로그 */}
            {showFailedLog && result.failedLogs.length > 0 && (
              <div className="px-5 py-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase mb-2">
                  수신 실패 (구독 만료 — 재구독 필요)
                </p>
                <div className="space-y-1.5">
                  {result.failedLogs.map((name, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                      <span className="text-sm text-slate-400">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
