"use client";

import { useEffect, useState, FormEvent } from "react";
import { CopyCodeButton } from "@/app/components/CopyCodeButton";
import { AdminPageHeader, ADMIN_ERROR_CLASS } from "../_components/AdminPageHeader";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type InviteCode = {
  id: string;
  code: string;
  branch_name: string;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  created_at: string;
};

type PendingManager = {
  id: string;
  login_id: string;
  full_name: string | null;
  branch_name: string | null;
  birth_date: string | null;
  phone_number: string | null;
  created_at: string;
};

export default function InviteCodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [managers, setManagers] = useState<PendingManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [managersLoading, setManagersLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managersError, setManagersError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [managerCodeByManager, setManagerCodeByManager] = useState<Record<string, string>>({});
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/invite-codes");
        const data = await res.json();
        if (!res.ok) {
          setError(data.message ?? "초대 코드를 불러오지 못했습니다.");
          return;
        }
        setCodes(data.codes ?? []);
      } catch {
        setError("네트워크 오류로 초대 코드를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();

    const loadManagers = async () => {
      try {
        const res = await fetch("/api/admin/pending-agents");
        const data = await res.json();
        if (!res.ok) {
          setManagersError(data.message ?? "승인 대기 목록을 불러오지 못했습니다.");
          return;
        }
        setManagers(data.agents ?? []);
      } catch {
        setManagersError("네트워크 오류로 승인 대기 목록을 불러오지 못했습니다.");
      } finally {
        setManagersLoading(false);
      }
    };
    loadManagers();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // 프론트에서도 1개 제한 가드
    if (codes.length > 0) {
      setError("이 지점에는 이미 생성된 초대 코드가 있습니다. 기존 코드를 삭제한 뒤 다시 시도해주세요.");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대 코드 생성에 실패했습니다.");
        return;
      }
      if (data.code) {
        setCodes((prev) => [data.code, ...prev]);
      }
    } catch {
      setError("네트워크 오류로 초대 코드 생성에 실패했습니다.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("해당 초대 코드를 삭제하시겠습니까?")) return;
    setError(null);
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/invite-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "초대 코드 삭제에 실패했습니다.");
        return;
      }
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("네트워크 오류로 초대 코드를 삭제할 수 없습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const generateInviteUrl = (code: string): string => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/apply?code=${code}`;
  };

  const handleCopyUrlToClipboard = async (id: string, code: string) => {
    try {
      const url = generateInviteUrl(code);
      await navigator.clipboard.writeText(url);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = generateInviteUrl(code);
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(textArea);
      }
    }
    setCopiedUrlId(id);
    setTimeout(() => setCopiedUrlId(null), 2500);
  };

  const handleManagerAction = async (profileId: string, action: "approve" | "reject") => {
    setActingId(profileId);
    setManagersError(null);
    const managerCode = (managerCodeByManager[profileId] ?? "").trim();
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          action,
          ...(managerCode !== "" ? { managerCode } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setManagersError(data.message ?? "처리에 실패했습니다.");
        return;
      }
      setManagers((prev) => prev.filter((m) => m.id !== profileId));
      setManagerCodeByManager((prev) => {
        const next = { ...prev };
        delete next[profileId];
        return next;
      });
    } catch {
      setManagersError("네트워크 오류로 처리에 실패했습니다.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background-light px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <AdminPageHeader
          title="매니저 초대 & 승인 관리"
          description="초대 코드를 생성하고, URL을 통해 매니저를 초대한 후 승인합니다."
        />

        {error && <div className={ADMIN_ERROR_CLASS}>{error}</div>}

        <form onSubmit={handleCreate} className="mb-5">
          <EclipseButton
            type="submit"
            disabled={creating}
            isLoading={creating}
            text={creating ? "생성 중..." : "+ 새 초대 코드 생성"}
            variant="primary"
            size="default"
          />
        </form>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">
              초대 코드 리스트
            </h2>
            <span className="text-[11px] text-brand-gray">
              총 {codes.length}개
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="text-[14px]">
                  <div className="relative w-[2.5em] h-[2.5em] rotate-[165deg]">
                    <span className="beforeEl" />
                    <span className="afterEl" />
                  </div>
                </div>
                <p className="text-xs text-brand-gray">초대 코드를 불러오는 중...</p>
              </div>
            ) : codes.length === 0 ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                아직 생성된 초대 코드가 없습니다. 상단 버튼으로 새 코드를
                생성하세요.
              </div>
            ) : (
              codes.map((c) => (
                <div key={c.id} className="px-4 py-4 flex flex-col gap-3 text-sm">
                  {/* 코드 정보 + 삭제 */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-brand-black">{c.code}</p>
                      <p className="text-[11px] text-brand-gray mt-0.5">
                        {c.branch_name} ·{" "}
                        {new Date(c.created_at).toLocaleString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-[11px] text-brand-gray mt-0.5">
                        사용{" "}
                        <span className="font-semibold text-brand-black">
                          {c.used_count}
                        </span>
                        {c.max_uses ? ` / ${c.max_uses}` : " / 제한 없음"}
                        {c.expires_at && (
                          <> · 만료: {new Date(c.expires_at).toLocaleDateString("ko-KR")}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <CopyCodeButton code={c.code} />
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        disabled={deletingId === c.id}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 disabled:opacity-50"
                        aria-label="초대 코드 삭제"
                      >
                        <span className="text-rose-500 text-lg" aria-hidden>🗑</span>
                      </button>
                    </div>
                  </div>

                  {/* 초대링크 복사 + 자동승인 안내 */}
                  <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-blue-800">초대 링크</p>
                        <p className="text-[10px] text-blue-600 truncate mt-0.5 font-mono">
                          {typeof window !== "undefined"
                            ? `${window.location.origin}/apply?code=${c.code}`
                            : `/apply?code=${c.code}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyUrlToClipboard(c.id, c.code)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          copiedUrlId === c.id
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {copiedUrlId === c.id ? (
                          <>
                            <span aria-hidden>✓</span> 복사됨
                          </>
                        ) : (
                          <>
                            <span aria-hidden>🔗</span> 초대링크 복사
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-blue-700 flex items-start gap-1">
                      <span className="mt-px" aria-hidden>ⓘ</span>
                      <span>이 링크로 가입하면 별도 승인 없이 <strong>즉시 자동 승인</strong>됩니다. 신뢰할 수 있는 매니저에게만 공유하세요.</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm mt-6">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-brand-black">
              승인 대기 매니저
            </h2>
            <span className="text-[11px] text-brand-gray">
              총 {managers.length}명
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {managersLoading ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                불러오는 중...
              </div>
            ) : managers.length === 0 ? (
              <div className="px-4 py-6 text-xs text-brand-gray">
                현재 승인 대기 중인 매니저가 없습니다.
              </div>
            ) : (
              managers.map((m) => (
                <div
                  key={m.id}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-black truncate">
                      {m.full_name ?? "(이름 없음)"}
                    </p>
                    <p className="text-[11px] text-brand-gray mt-0.5">
                      생년월일: {m.birth_date ?? "-"} · 휴대폰: {m.phone_number ?? "-"}
                    </p>
                    <p className="text-[11px] text-brand-gray">
                      신청일{" "}
                      {new Date(m.created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0 items-stretch sm:items-center">
                    <input
                      type="text"
                      placeholder="매니저 코드 (매니저로 승인 시)"
                      value={managerCodeByManager[m.id] ?? ""}
                      onChange={(e) =>
                        setManagerCodeByManager((prev) => ({
                          ...prev,
                          [m.id]: e.target.value,
                        }))
                      }
                      className="w-full sm:w-44 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex gap-2">
                      <EclipseButton
                        type="button"
                        disabled={actingId !== null}
                        isLoading={actingId === m.id}
                        text={actingId === m.id ? "처리 중..." : "승인"}
                        variant="primary"
                        size="sm"
                        onClick={() => handleManagerAction(m.id, "approve")}
                      />
                      <EclipseButton
                        type="button"
                        disabled={actingId !== null}
                        text="거절"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleManagerAction(m.id, "reject")}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {managersError && <div className={ADMIN_ERROR_CLASS + " mt-4"}>{managersError}</div>}
      </div>
    </main>
  );
}
