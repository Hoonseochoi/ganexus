"use client";

import { createContext, useContext, useState } from "react";
import { IntIcon } from "@/app/components/ui/interactive-animated-arrow-icon";

const ARROW_RIGHT_CIRCLE_LOTTIE =
  "https://res.cloudinary.com/dhdupwqli/raw/upload/arrowRightCircle_zf9kg7.json";

type RightPanelContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const RightPanelContext = createContext<RightPanelContextValue | null>(null);

export function useRightPanel() {
  return useContext(RightPanelContext);
}

/** 데스크톱에서 우측 패널 열림 상태 제공. 날짜 클릭 시 패널 열림용으로 사용 */
export function DesktopRightPanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <RightPanelContext.Provider value={{ open, setOpen }}>
      {children}
    </RightPanelContext.Provider>
  );
}

type Props = {
  children: React.ReactNode;
};

export default function RightPanelCollapseWrapper({ children }: Props) {
  const ctx = useRightPanel();
  const open = ctx?.open ?? true;
  const setOpen = ctx?.setOpen ?? (() => {});

  return (
    <>
      {/* 캘린더와 우측 패널 경계에 걸치는 원형 화살표 닫기 버튼 */}
      {open && (
        <div className="w-0 flex-shrink-0 self-stretch relative pointer-events-none">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto rounded-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            role="button"
            tabIndex={0}
            aria-label="우측 패널 닫기"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(false);
              }
            }}
          >
            <IntIcon
              animationData={ARROW_RIGHT_CIRCLE_LOTTIE}
              color="black"
              playOnClick
              size={40}
              autoplay
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
      <div
        className={`flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-out ${open ? "w-80" : "w-0"}`}
      >
        <div
          className={`relative w-80 h-full transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
