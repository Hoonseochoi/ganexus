import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "GA NEXUS",
  description: "지점 통합 관리 캘린더",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background-light text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

