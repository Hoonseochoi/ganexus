"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, AlertCircle, Loader2 } from "lucide-react";

type PushStatus = "checking" | "unsupported" | "denied" | "subscribed" | "unsubscribed";

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

type Props = {
  /** compact: 좌측 패널용 작은 크기 */
  compact?: boolean;
};

export default function PushSettingToggle({ compact = false }: Props) {
  const [status, setStatus] = useState<PushStatus>("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setStatus(subscription ? "subscribed" : "unsubscribed");
    } catch {
      setStatus("unsubscribed");
    }
  }, []);

  useEffect(() => {
    void checkStatus();
  }, [checkStatus]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission === "denied") { setStatus("denied"); return; }
      if (permission !== "granted") { return; }

      const registration = await navigator.serviceWorker.ready;
      const keyRes = await fetch("/api/push/vapid-public-key");
      const { publicKey } = await keyRes.json() as { publicKey?: string };
      if (!publicKey) throw new Error("VAPID 키 없음");

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      if (!res.ok) throw new Error("구독 저장 실패");

      setStatus("subscribed");
    } catch {
      setError("알림 설정 중 오류가 발생했습니다.");
      await checkStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch {
      setError("해제 중 오류가 발생했습니다.");
      await checkStatus();
    } finally {
      setLoading(false);
    }
  };

  if (status === "checking") {
    return (
      <div className={`flex items-center gap-2 text-brand-gray ${compact ? "px-3 py-2" : "p-4"}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-xs">알림 상태 확인 중...</span>
      </div>
    );
  }

  if (status === "unsupported") {
    return (
      <div className={`flex items-center gap-2 text-slate-400 ${compact ? "px-3 py-2" : "p-4"}`}>
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span className="text-xs">이 기기는 푸시 알림을 지원하지 않습니다.</span>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className={`${compact ? "px-3 py-2" : "p-4"}`}>
        <div className="flex items-start gap-2 text-amber-600">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="text-xs leading-relaxed">
            브라우저에서 알림이 차단됐습니다.<br />
            브라우저 설정 → 알림 → 허용으로 변경해주세요.
          </span>
        </div>
      </div>
    );
  }

  const isSubscribed = status === "subscribed";

  if (compact) {
    return (
      <div className="px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {isSubscribed
              ? <Bell className="w-4 h-4 text-sky-500 shrink-0" />
              : <BellOff className="w-4 h-4 text-slate-400 shrink-0" />
            }
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-700 truncate">푸시 알림</p>
              <p className="text-[11px] text-brand-gray">
                {isSubscribed ? "수신 중" : "수신 안 함"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={loading}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 ${
              isSubscribed
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                : "bg-sky-500 text-white hover:bg-sky-600"
            }`}
          >
            {loading ? "..." : isSubscribed ? "허용안함" : "허용"}
          </button>
        </div>
        {error && <p className="mt-1 text-[11px] text-rose-500">{error}</p>}
      </div>
    );
  }

  // 기본 (어드민 페이지용) 크기
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isSubscribed ? "bg-sky-100" : "bg-slate-100"
        }`}>
          {isSubscribed
            ? <Bell className="w-5 h-5 text-sky-500" />
            : <BellOff className="w-5 h-5 text-slate-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">내 푸시 알림</p>
          <p className="text-xs text-brand-gray mt-0.5">
            {isSubscribed
              ? "이 기기에서 푸시 알림을 수신하고 있습니다."
              : "이 기기에서 푸시 알림을 수신하지 않습니다."}
          </p>
        </div>
        <button
          type="button"
          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
          disabled={loading}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${
            isSubscribed
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
              : "bg-sky-500 text-white hover:bg-sky-600"
          }`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSubscribed ? "허용 안함" : "허용"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-rose-500 text-center">{error}</p>
      )}
    </div>
  );
}
