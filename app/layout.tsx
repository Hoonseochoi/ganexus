import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "GA NEXUS",
  description: "지점 통합 관리 캘린더",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className="bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}

