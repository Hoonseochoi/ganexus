"use client";

import { useState, FormEvent } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";
import { X } from "lucide-react";

export interface AddManagerModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddManagerModal({ onClose, onSuccess }: AddManagerModalProps) {
  const [managerCode, setManagerCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = managerCode.trim();
    const name = fullName.trim();
    const branch = branchName.trim();
    if (!code || !name || !branch) {
      setError("매니저 코드, 이름, 지점명을 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/managers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          managerCode: code,
          fullName: name,
          branchName: branch,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "등록에 실패했습니다.");
        return;
      }
      onSuccess();
    } catch {
      setError("네트워크 오류로 등록할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">교육매니저 등록</h2>
            <p className="text-xs text-slate-500 mt-1">새 교육매니저를 등록합니다. 매니저코드로 로그인(ID/PW 동일)할 수 있습니다.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                매니저 코드 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={managerCode}
                onChange={(e) => setManagerCode(e.target.value)}
                placeholder="예: MANAGER-01"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              />
              <p className="text-[11px] text-slate-400 font-medium">
                로그인 시 ID·비밀번호 모두 이 코드를 사용합니다.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">
                지점명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                placeholder="예: 메리츠 강남지점"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-brand-black focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
              />
            </div>
            
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <div className="flex-1">
                <EclipseButton
                  type="submit"
                  disabled={loading}
                  isLoading={loading}
                  text={loading ? "등록 중..." : "등록하기"}
                  variant="primary"
                  className="w-full py-3 !rounded-xl"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
