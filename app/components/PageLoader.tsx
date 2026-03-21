"use client";

import LoaderGrid from "@/components/ui/loader-grid";

interface PageLoaderProps {
  message?: string;
}

export default function PageLoader({ message = "로딩 중..." }: PageLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-light">
      {/* 로고 영역 */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-brand-black">GA NEXUS</span>
        <span className="text-xs text-brand-gray">General Agency Management System</span>
      </div>

      {/* 로더 */}
      <div className="text-[20px]">
        <LoaderGrid />
      </div>

      {/* 메시지 */}
      <p className="mt-8 text-sm font-medium text-brand-gray animate-fade-in">{message}</p>
    </div>
  );
}
