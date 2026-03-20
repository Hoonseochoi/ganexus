"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Settings, Info, CheckCircle, Users, CalendarDays } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SettingItemProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  badge?: number;
  onClick?: () => void;
}

const SettingItem = ({ href, icon, iconBg, label, badge, onClick }: SettingItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 transition-colors group"
  >
    <div className={cn("w-7 h-7 rounded-md flex items-center justify-center text-white", iconBg)}>
      {icon}
    </div>
    <span className="flex-1 text-[14px] font-medium text-slate-700">{label}</span>
    {badge != null && badge > 0 && (
      <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
        {badge > 99 ? "99+" : badge}
      </span>
    )}
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
  </Link>
);

export default function AdminSettingsMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // 승인 대기 인원 수 조회 (30초마다 갱신)
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("/api/admin/pending-agents");
        if (!res.ok) return;
        const data = await res.json();
        setPendingCount(data.agents?.length ?? 0);
      } catch {
        // 조회 실패 시 무시
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30_000);
    return () => clearInterval(interval);
  }, []);

  const adminLinks = [
    {
      href: "/admin/branch",
      label: "지점 정보 설정",
      icon: <Info className="w-4 h-4" />,
      iconBg: "bg-blue-500",
    },
    {
      href: "/admin/approvals",
      label: "매니저 승인",
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: "bg-green-500",
      badge: pendingCount,
    },
    {
      href: "/admin/members",
      label: "교육매니저등록",
      icon: <Users className="w-4 h-4" />,
      iconBg: "bg-indigo-500",
    },
    {
      href: "/weekly-schedule",
      label: "주간일정",
      icon: <CalendarDays className="w-4 h-4" />,
      iconBg: "bg-cyan-500",
    },
  ];

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
          "w-5 h-5 flex items-center justify-center rounded transition-colors relative",
          isOpen ? "text-primary" : "text-brand-gray"
        )}>
          <Settings className={cn("w-5 h-5", isOpen && "animate-spin-slow")} />
          {/* 설정 버튼에 뱃지 (메뉴 닫혀있을 때만 표시) */}
          {!isOpen && pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {pendingCount > 99 ? "99+" : pendingCount}
            </span>
          )}
        </div>
        <span className="text-sm font-semibold flex-1">설정</span>
        <ChevronRight className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen ? "rotate-90 text-primary" : "text-slate-300"
        )} />
      </button>

      {isOpen && (
        <div className="mt-2 mx-1 overflow-hidden bg-white border border-slate-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="divide-y divide-slate-50">
            {adminLinks.map((link) => (
              <SettingItem
                key={link.href}
                {...link}
                onClick={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
