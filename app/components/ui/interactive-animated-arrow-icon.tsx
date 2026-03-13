"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import lottie, { type AnimationItem } from "lottie-web";

export type IntIconColor = "black" | "white" | null;

export interface IntIconProps {
  animationData: object | string;
  autoplay?: boolean;
  loop?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  playOnClick?: boolean;
  toggleDirectionOnClick?: boolean;
  playDirectionOnEnter?: 1 | -1 | null;
  playDirectionOnLeave?: 1 | -1 | null;
  color?: IntIconColor;
  size?: number | string;
  className?: string;
}

export function IntIcon({
  animationData,
  autoplay = false,
  loop = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  playOnClick = false,
  toggleDirectionOnClick = false,
  playDirectionOnEnter = null,
  playDirectionOnLeave = null,
  color = null,
  size = 100,
  className,
}: IntIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationInstance = useRef<AnimationItem | null>(null);
  const [directionForward, setDirectionForward] = useState(true);
  const [resolvedAnimationData, setResolvedAnimationData] = useState<object | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const sizeStyle = React.useMemo(() => {
    if (typeof size === "number") return `${size}px`;
    return size;
  }, [size]);

  useEffect(() => {
    if (!animationData) return;
    if (typeof animationData === "string") {
      fetch(animationData)
        .then((res) => res.json())
        .then((data: object) => setResolvedAnimationData(data))
        .catch((err) => {
          console.error("Failed to load Lottie JSON from URL:", err);
        });
    } else {
      setResolvedAnimationData(animationData);
    }
  }, [animationData]);

  const applyColor = React.useCallback(
    (colorValue: "black" | "white") => {
      if (!animationInstance.current || !containerRef.current) return;
      const svgElement = containerRef.current.querySelector("svg");
      if (!svgElement) return;
      const hex = colorValue === "black" ? "#000000" : "#FFFFFF";
      const elements = svgElement.querySelectorAll("path, circle, rect, ellipse, polygon, line, polyline");
      elements.forEach((el) => {
        if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
          (el as SVGElement).style.fill = hex;
        }
        if (el.getAttribute("stroke") && el.getAttribute("stroke") !== "none") {
          (el as SVGElement).style.stroke = hex;
        }
      });
    },
    []
  );

  useEffect(() => {
    if (!containerRef.current || !resolvedAnimationData) return;

    animationInstance.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop,
      autoplay,
      animationData: resolvedAnimationData,
    });

    if (color && (color === "black" || color === "white")) {
      animationInstance.current.addEventListener("DOMLoaded", () => {
        applyColor(color);
      });
    }

    animationInstance.current.addEventListener("complete", () => {
      setIsPlaying(false);
    });

    return () => {
      if (animationInstance.current) {
        animationInstance.current.removeEventListener("complete");
        animationInstance.current.destroy();
      }
    };
  }, [resolvedAnimationData, autoplay, loop, color, applyColor]);

  const handleClick = (e: React.MouseEvent) => {
    if (!animationInstance.current) return;
    const anim = animationInstance.current;

    if (toggleDirectionOnClick) {
      anim.setDirection(directionForward ? 1 : -1);
      anim.play();
      setDirectionForward(!directionForward);
      setIsPlaying(true);
    } else if (playOnClick) {
      if (!isPlaying) {
        if (!loop) anim.goToAndStop(0, true);
        anim.setDirection(1);
        anim.play();
        setIsPlaying(true);
      }
    }
    onClick?.(e);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (animationInstance.current && playDirectionOnEnter !== null) {
      animationInstance.current.setDirection(playDirectionOnEnter);
      animationInstance.current.play();
      setIsPlaying(true);
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (animationInstance.current && playDirectionOnLeave !== null) {
      animationInstance.current.setDirection(playDirectionOnLeave);
      animationInstance.current.play();
      setIsPlaying(true);
    }
    onMouseLeave?.(e);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        cursor: "pointer",
        display: "inline-block",
        width: sizeStyle,
        height: sizeStyle,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {!resolvedAnimationData && (
        <span className="text-muted-foreground text-xs">Loading…</span>
      )}
    </div>
  );
}
