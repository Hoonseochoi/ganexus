'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

// base64url → Uint8Array 변환 (VAPID 공개키용)
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export default function PushNotificationPrompt() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // PWA standalone 모드에서만 표시
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;

    if (!isStandalone) return;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    // 이미 허용/거부된 경우 표시 안 함
    if (Notification.permission === 'granted') {
      setSubscribed(true);
      return;
    }
    if (Notification.permission === 'denied') return;

    // 이미 본 경우 (세션 내 1회)
    if (sessionStorage.getItem('push-prompt-shown')) return;

    // 약간의 딜레이 후 표시
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setShow(false);
        sessionStorage.setItem('push-prompt-shown', '1');
        return;
      }

      // 서비스워커 준비 대기
      const registration = await navigator.serviceWorker.ready;

      // VAPID 공개키 조회
      const keyRes = await fetch('/api/push/vapid-public-key');
      const { publicKey } = await keyRes.json() as { publicKey: string };

      // 구독 생성
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 서버에 구독 저장
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      setSubscribed(true);
      setShow(false);
      sessionStorage.setItem('push-prompt-shown', '1');
    } catch {
      // 구독 실패 시 조용히 처리
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = () => {
    sessionStorage.setItem('push-prompt-shown', '1');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 max-w-sm mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">일정 알림 받기</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              매일 오후 6시, 내일 일정을 미리 알려드립니다.
            </p>
          </div>
          <button
            onClick={handleDeny}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDeny}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            나중에
          </button>
          <button
            onClick={handleAllow}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 transition-colors disabled:opacity-60"
          >
            {loading ? '설정 중...' : '알림 허용'}
          </button>
        </div>
      </div>
    </div>
  );
}
