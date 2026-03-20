"use client";

import { useState } from "react";
import { ChevronRight, Settings, Bell } from "lucide-react";
import { cn } from "@/src/lib/utils";
import PushSettingToggle from "@/app/components/ui/PushSettingToggle";

export default function ManagerSettingsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
          isOpen ? "bg-primary/10 text-primary" : "text-brand-gray hover:bg-slate-50"
        )}
      >
        <div className={cn(
          "w-5 h-5 flex items-center justify-center rounded transition-colors",
          isOpen ? "text-primary" : "text-brand-gray"
        )}>
          <Settings className={cn("w-5 h-5", isOpen && "animate-spin-slow")} />
        </div>
        <span className="text-sm font-semibold flex-1">설정</span>
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen ? "rotate-90 text-primary" : "text-slate-300"
        )} />
      </button>

      {isOpen && (
        <div className="mt-2 mx-1 overflow-hidden bg-white border border-slate-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 푸시 알림 설정 항목 */}
          <div className="px-2 pt-2 pb-1">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              <div className="w-6 h-6 rounded-md bg-sky-500 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                푸시 알림 설정
              </span>
            </div>
            <PushSettingToggle compact />
          </div>
          <div className="h-px bg-slate-50 mx-3" />
          <p className="px-4 py-2.5 text-[11px] text-slate-400 leading-relaxed">
            허용 시 매일 오후 6시에 내일 일정을 알려드립니다.
          </p>
        </div>
      )}
    </div>
  );
}
