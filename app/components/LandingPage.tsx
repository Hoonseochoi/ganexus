"use client";

import Link from "next/link";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background-light px-4 py-8">
      <div className="w-full max-w-md mx-auto text-center mb-8">
        <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
          GA
        </div>
        <h1 className="text-2xl font-bold text-brand-black tracking-tight">
          GA NEXUS
        </h1>
        <p className="mt-1 text-sm text-brand-gray">
          지점 캘린더 · 일정 관리 포털
        </p>
      </div>
      <div className="w-full max-w-sm mx-auto space-y-3">
        <Link href="/login" className="block">
          <EclipseButton
            type="button"
            variant="primary"
            text="관리자 로그인"
            className="w-full"
          />
        </Link>
        <Link href="/admin/signup" className="block">
          <EclipseButton
            type="button"
            variant="outline"
            text="관리자 회원가입"
            className="w-full"
          />
        </Link>
      </div>
      <p className="mt-8 text-[11px] text-brand-gray">
        최초 가입 시 사번으로 로그인 후 비밀번호 변경이 필요합니다.
      </p>
    </main>
  );
}
