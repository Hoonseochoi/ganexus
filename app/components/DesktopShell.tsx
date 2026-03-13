"use client";

import { useState, createContext, useContext } from "react";

type ShellContextValue = {
  leftOpen: boolean;
  setLeftOpen: (v: boolean) => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function useDesktopShell() {
  const ctx = useContext(ShellContext);
  return ctx;
}

export function DesktopShellHamburger() {
  const ctx = useDesktopShell();
  if (!ctx) return null;
  return (
    <button
      type="button"
      onClick={() => ctx.setLeftOpen(!ctx.leftOpen)}
      className="flex flex-col justify-center gap-1 w-8 h-8 rounded-lg border border-slate-200 bg-white shadow-sm hover:bg-slate-50 flex-shrink-0"
      aria-label={ctx.leftOpen ? "메뉴 닫기" : "메뉴 열기"}
    >
      <span className="block w-4 h-0.5 bg-slate-600 mx-auto rounded" />
      <span className="block w-4 h-0.5 bg-slate-600 mx-auto rounded" />
      <span className="block w-4 h-0.5 bg-slate-600 mx-auto rounded" />
    </button>
  );
}

type Props = {
  leftPanel: React.ReactNode;
  children: React.ReactNode;
};

export default function DesktopShell({ leftPanel, children }: Props) {
  const [leftOpen, setLeftOpen] = useState(false);

  return (
    <ShellContext.Provider value={{ leftOpen, setLeftOpen }}>
      {/* 백드롭: 패널 밖 클릭 시 닫기 */}
      {leftOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setLeftOpen(false)}
        />
      )}
      {/* 좌측 패널: 오버레이, 기본 숨김. 밖으로 마우스 나가면 닫기 */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col z-50 shadow-xl transition-transform duration-200 ease-out ${
          leftOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onMouseLeave={() => setLeftOpen(false)}
      >
        {leftPanel}
      </aside>
      {/* 메인 영역: 좌측 패널 숨김 시 캘린더 확장 */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {children}
      </div>
    </ShellContext.Provider>
  );
}
