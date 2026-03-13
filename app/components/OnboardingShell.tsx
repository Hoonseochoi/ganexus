"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = { id: string; title: string };

type Props = {
  steps: Step[];
  currentStep: number;
  children: ReactNode;
  onStepChange: (idx: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isNextDisabled?: boolean;
};

export default function OnboardingShell({
  steps,
  currentStep,
  children,
  onStepChange,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
  isNextDisabled,
}: Props) {
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="w-full max-w-lg mx-auto py-10">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex flex-col items-center"
              whileHover={{ scale: index <= currentStep ? 1.05 : 1 }}
            >
              <motion.button
                type="button"
                className={[
                  "w-4 h-4 rounded-full cursor-pointer transition-colors duration-300",
                  index < currentStep
                    ? "bg-primary"
                    : index === currentStep
                    ? "bg-primary ring-4 ring-primary/20"
                    : "bg-slate-200",
                ].join(" ")}
                onClick={() => {
                  if (index <= currentStep) onStepChange(index);
                }}
                whileTap={{ scale: 0.95 }}
              />
              <span
                className={[
                  "text-[11px] mt-1.5 hidden sm:block",
                  index === currentStep
                    ? "text-primary font-medium"
                    : "text-slate-400",
                ].join(" ")}
              >
                {step.title}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%`,
            }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center px-6 pb-5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentStep === 0}
            className="text-xs px-3 py-1.5 rounded-2xl border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            type="button"
            onClick={isLast ? onSubmit : onNext}
            disabled={!!isNextDisabled || !!isSubmitting}
            className="text-xs px-4 py-1.5 rounded-2xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {isSubmitting
              ? "처리 중..."
              : isLast
              ? "시작하기"
              : "다음"}
          </button>
        </div>
      </motion.div>

      <div className="mt-3 text-center text-[11px] text-slate-400">
        Step {currentStep + 1} / {steps.length} · {steps[currentStep].title}
      </div>
    </div>
  );
}

