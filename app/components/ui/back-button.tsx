"use client";

import { ArrowLeft } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

/**
 * 뒤로가기 버튼
 * - 기본: 화살표 스트립(좌측) + "뒤로" 텍스트
 * - 호버: 화살표 스트립이 버튼 전체로 확장, 텍스트 페이드 아웃
 * - onClick 미전달 시 window.history.back() 호출
 */
export function BackButton({ onClick, className }: BackButtonProps) {
  const handleClick = () => {
    if (onClick) onClick();
    else window.history.back();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="뒤로가기"
      className={cn(
        "group relative inline-flex h-8 items-center overflow-hidden rounded-full",
        "border border-slate-200 bg-white text-slate-600",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1",
        "active:scale-95 transition-transform duration-100",
        className
      )}
    >
      {/* 텍스트: 호버 시 페이드 아웃 */}
      <span className="relative z-10 select-none px-3 text-[12px] font-medium tracking-wide transition-opacity duration-300 group-hover:opacity-0">
        뒤로
      </span>

      {/* 화살표 패널: 좌측에서 시작해 호버 시 전체로 확장 */}
      <i
        aria-hidden
        className="absolute inset-y-0 left-0 z-20 flex w-8 items-center justify-center rounded-full bg-slate-800 transition-all duration-300 ease-out group-hover:w-full"
      >
        <ArrowLeft
          size={13}
          strokeWidth={2.5}
          className="text-white"
        />
      </i>
    </button>
  );
}
