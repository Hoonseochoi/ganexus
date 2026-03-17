"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Settings, Info, CheckCircle, UserPlus, Users, Calendar } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SettingItemProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  onClick?: () => void;
}

const SettingItem = ({ href, icon, iconBg, label, onClick }: SettingItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 transition-colors group"
  >
    <div className={cn("w-7 h-7 rounded-md flex items-center justify-center text-white", iconBg)}>
      {icon}
    </div>
    <span className="flex-1 text-[14px] font-medium text-slate-700">{label}</span>
    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
  </Link>
);

export default function AdminSettingsMenu({ onNavigate }: { onNavigate?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const adminLinks = [
    {
      href: "/admin/branch",
      label: "지점 정보 설정",
      icon: <Info className="w-4 h-4" />,
      iconBg: "bg-blue-500",
    },
    {
      href: "/admin/approvals",
      label: "에이전트 승인",
      icon: <CheckCircle className="w-4 h-4" />,
      iconBg: "bg-green-500",
    },
    {
      href: "/admin/managers",
      label: "매니저 등록",
      icon: <UserPlus className="w-4 h-4" />,
      iconBg: "bg-orange-500",
    },
    {
      href: "/admin/members",
      label: "멤버 관리",
      icon: <Users className="w-4 h-4" />,
      iconBg: "bg-indigo-500",
    },
    {
      href: "/admin/schedules",
      label: "일정 추가",
      icon: <Calendar className="w-4 h-4" />,
      iconBg: "bg-rose-500",
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
