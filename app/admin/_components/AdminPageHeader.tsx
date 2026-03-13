"use client";

import type { ReactNode } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

export function AdminPageHeader({
  title,
  description,
  rightSlot,
}: {
  title: string;
  description: string;
  rightSlot?: ReactNode;
}) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <EclipseButton
            type="button"
            variant="outline"
            size="icon"
            onClick={() => window.history.back()}
            aria-label="뒤로가기"
            className="!h-8 !w-8 !min-w-0 !p-0 text-sm"
          >
            ←
          </EclipseButton>
          <p className="text-xs text-brand-gray">GA NEXUS 관리자 설정</p>
        </div>
        <h1 className="text-xl font-semibold text-brand-black">{title}</h1>
        <p className="mt-1 text-[11px] text-brand-gray">{description}</p>
      </div>
      {rightSlot}
    </header>
  );
}

export const ADMIN_ERROR_CLASS =
  "mb-4 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700";
