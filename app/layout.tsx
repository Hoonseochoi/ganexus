import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "GALENDER",
  description: "우리만의 GA 캘린더",
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

