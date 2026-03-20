'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { AdminPageHeader } from '@/app/admin/_components/AdminPageHeader';

export default function AdminPushPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim() }),
      });
      const data = await res.json() as { sent: number; failed: number };
      setResult(data);
      setTitle('');
      setBody('');
    } catch {
      setResult({ sent: 0, failed: -1 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-lg mx-auto pt-8">
        <AdminPageHeader
          title="푸시 알림 발송"
          description="지점 전체 멤버에게 알림을 보냅니다"
        />

        {/* 입력 폼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
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
            {loading ? '발송 중...' : '전체 발송'}
          </button>
        </div>

        {/* 발송 결과 */}
        {result && (
          <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${
            result.failed === -1
              ? 'bg-red-50 text-red-600'
              : 'bg-green-50 text-green-700'
          }`}>
            {result.failed === -1
              ? '발송 중 오류가 발생했습니다. 다시 시도해주세요.'
              : `✅ 발송 완료 — 성공 ${result.sent}명 / 실패 ${result.failed}명`}
          </div>
        )}
      </div>
    </div>
  );
}
