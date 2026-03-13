'use client';

import React from "react";
import { cn } from "@/src/lib/utils";
import { useScroll } from "@/app/components/ui/use-scroll";

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 border-border backdrop-blur-lg":
          scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            GA
          </div>
          <span className="text-sm font-semibold tracking-tight text-brand-black">
            GALENDER
          </span>
        </div>
        <div className="text-[11px] text-brand-gray hidden sm:block">
          우리 지점만의 캘린더, GALENDER
        </div>
      </nav>
    </header>
  );
}

