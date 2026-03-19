"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Approvals 페이지는 더 이상 사용되지 않습니다.
 * 초대 코드 관리와 승인 기능이 "/admin/invite-codes"로 통합되었습니다.
 */
export default function AdminApprovalsPage() {
  const router = useRouter();

  useEffect(() => {
    // 자동으로 새 페이지로 리다이렉트
    router.replace("/admin/invite-codes");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="text-center">
        <p className="text-sm text-brand-gray mb-2">페이지가 이동되었습니다...</p>
        <a href="/admin/invite-codes" className="text-primary hover:underline text-sm font-medium">
          매니저 초대 & 승인 관리로 이동
        </a>
      </div>
    </main>
  );
}
