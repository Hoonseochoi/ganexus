"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface EclipseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const EclipseButton = React.forwardRef<HTMLButtonElement, EclipseButtonProps>(
  (
    {
      text,
      variant = "primary",
      size = "default",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const maskX = useSpring(mouseX, { stiffness: 250, damping: 25 });
    const maskY = useSpring(mouseY, { stiffness: 250, damping: 25 });

    const buttonX = useTransform(maskX, (value) => (value - 50) * 0.15);
    const buttonY = useTransform(maskY, (value) => (value - 20) * 0.15);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || disabled || isLoading) return;
      const rect = buttonRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const variantStyles = {
      primary: {
        base: "bg-primary text-white border-primary",
        overlay: "bg-white text-primary",
      },
      outline: {
        base: "bg-transparent text-brand-black border-slate-200",
        overlay: "bg-primary text-white border-primary",
      },
      ghost: {
        base: "bg-transparent text-slate-600 border-transparent",
        overlay: "bg-slate-100 text-brand-black",
      },
      destructive: {
        base: "bg-red-600 text-white border-red-600",
        overlay: "bg-white text-red-600",
      },
    };

    const sizeStyles = {
      default: "h-12 px-8 text-sm",
      sm: "h-10 px-5 text-xs",
      lg: "h-14 px-10 text-base",
      icon: "h-12 w-12 p-0",
    };

    const currentVariant = variantStyles[variant];
    const label = text ?? (typeof children === "string" ? children : undefined);

    const renderContent = (isOverlay = false) => (
      <motion.span
        className={cn(
          "flex items-center justify-center",
          (label || children) && (leftIcon || rightIcon || isLoading)
            ? "gap-2"
            : ""
        )}
        animate={{
          letterSpacing: isHovered && label ? "0.05em" : "0em",
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && (
          <span className="flex items-center justify-center">{leftIcon}</span>
        )}
        {(label || (children && !leftIcon && !rightIcon && !isLoading)) && (
          <span>{label ?? children}</span>
        )}
        {!isLoading && rightIcon && (
          <span className="flex items-center justify-center">{rightIcon}</span>
        )}
      </motion.span>
    );

    const clipPath = useTransform(
      [maskX, maskY],
      ([x, y]: (number | string)[]) => {
        const xx = typeof x === "number" ? x : 0;
        const yy = typeof y === "number" ? y : 0;
        return isHovered
          ? `circle(100px at ${xx}px ${yy}px)`
          : "circle(0px at 50% 50%)";
      }
    );

    return (
      <motion.button
        ref={(node) => {
          (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn(
          "relative isolate overflow-hidden rounded-full border font-bold uppercase tracking-widest",
          "inline-flex items-center justify-center",
          currentVariant.base,
          sizeStyles[size],
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          (disabled || isLoading) && "cursor-not-allowed opacity-60",
          className
        )}
        style={{ x: buttonX, y: buttonY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        disabled={disabled || isLoading}
        whileTap={{ scale: 0.95 }}
        type={type}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        <svg className="absolute hidden" aria-hidden>
          <filter id="eclipseNoiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -2"
            />
            <feComposite operator="in" in2="SourceGraphic" result="monoNoise" />
            <feBlend in="SourceGraphic" in2="monoNoise" mode="screen" />
          </filter>
        </svg>

        <span className="relative z-10 pointer-events-none">
          {renderContent()}
        </span>

        <motion.div
          className={cn(
            "absolute inset-0 z-20 flex items-center justify-center",
            "pointer-events-none select-none",
            currentVariant.overlay,
            sizeStyles[size]
          )}
          style={{
            clipPath,
            WebkitClipPath: clipPath,
          }}
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{ filter: "url(#eclipseNoiseFilter)" }}
          />
          {renderContent(true)}
        </motion.div>
      </motion.button>
    );
  }
);

EclipseButton.displayName = "EclipseButton";

export { EclipseButton };
