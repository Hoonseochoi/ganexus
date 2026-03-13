"use client";

import { useState, useEffect } from "react";
import { EclipseButton } from "@/app/components/ui/EclipseButton";

type Props = {
  code: string;
  duration?: number;
  className?: string;
};

export function CopyCodeButton({ code, duration = 2500, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (copied) {
      const showTimer = setTimeout(() => setShowConfirmation(true), 300);
      setProgress(0);
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress(Math.min((elapsed / duration) * 100, 100));
        if (elapsed >= duration) {
          clearInterval(interval);
          setShowConfirmation(false);
          setTimeout(() => {
            setCopied(false);
            setProgress(0);
          }, 300);
        }
      }, 16);
      return () => {
        clearInterval(interval);
        clearTimeout(showTimer);
      };
    }
  }, [copied, duration]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = code;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
  };

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 min-w-[6rem] h-9 ${className}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 bg-slate-200 transition-opacity duration-300"
        style={{
          width: `${progress}%`,
          opacity: copied ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: copied ? 0 : 1,
          filter: copied ? "blur(6px)" : "blur(0)",
          transform: copied ? "scale(0.95)" : "scale(1)",
          transition: "all 0.3s ease-out",
          pointerEvents: copied ? "none" : "auto",
          zIndex: copied ? 0 : 10,
        }}
      >
        <EclipseButton
          type="button"
          variant="outline"
          size="sm"
          text="Copy"
          onClick={handleCopy}
          className="!normal-case"
        />
      </div>
      <div
        className="relative flex items-center gap-2"
        style={{
          opacity: showConfirmation ? 1 : 0,
          filter: showConfirmation ? "blur(0)" : "blur(6px)",
          transform: showConfirmation ? "scale(1)" : "scale(1.05)",
          transition: "all 0.35s ease-out",
          pointerEvents: "none",
          zIndex: 5,
        }}
      >
        <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <span className="text-xs font-semibold text-brand-black whitespace-nowrap">
          복사됨!
        </span>
      </div>
    </div>
  );
}
