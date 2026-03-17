"use client";

import { useEffect, useState } from "react";
import { EclipseButton } from "./ui/EclipseButton";

export default function PWAInstallHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if current display mode is standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Update global flag
      if (typeof window !== "undefined") {
        (window as any).pwaCanInstall = true;
        // Trigger a custom event to notify other components to re-render if needed
        window.dispatchEvent(new CustomEvent('pwaStateChange'));
      }

      // Show popup logic: only on mobile and only if not already installed
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;

      if (isMobile && !isStandalone) {
        // Check session storage to only show once per session
        const hasShown = sessionStorage.getItem("pwa-prompt-shown");
        if (!hasShown) {
          setShowPopup(true);
          sessionStorage.setItem("pwa-prompt-shown", "true");
        }
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        (window as any).pwaCanInstall = false;
        window.dispatchEvent(new CustomEvent('pwaStateChange'));
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPopup(false);
    if (typeof window !== "undefined") {
      (window as any).pwaCanInstall = false;
      window.dispatchEvent(new CustomEvent('pwaStateChange'));
    }
  };

  // Expose the install function to window so the header button can use it
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).triggerPWAInstall = handleInstallClick;
      (window as any).pwaCanInstall = !!deferredPrompt;
    }
  }, [deferredPrompt]);

  if (!showPopup || isInstalled) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <img src="/2cigalender.png" alt="Logo" className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-brand-black leading-tight">GALENDER 앱 설치</p>
            <p className="text-[11px] text-brand-gray">홈 화면에 추가하여 더 편하게 사용하세요.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPopup(false)}
            className="px-3 py-2 text-[11px] font-medium text-brand-gray hover:bg-slate-50 rounded-lg transition-colors"
          >
            나중에
          </button>
          <EclipseButton
            variant="primary"
            size="sm"
            text="설치하기"
            onClick={handleInstallClick}
            className="!py-2 !px-4 !text-[11px]"
          />
        </div>
      </div>
    </div>
  );
}
