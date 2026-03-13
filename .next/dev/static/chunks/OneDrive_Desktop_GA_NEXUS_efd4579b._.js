(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/OneDrive/Desktop/GA_NEXUS/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EclipseButton",
    ()=>EclipseButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const EclipseButton = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = _s(({ text, variant = "primary", size = "default", isLoading = false, leftIcon, rightIcon, className, disabled, children, type = "button", ...props }, ref)=>{
    _s();
    const buttonRef = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [isHovered, setIsHovered] = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const mouseX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const mouseY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const maskX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(mouseX, {
        stiffness: 250,
        damping: 25
    });
    const maskY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(mouseY, {
        stiffness: 250,
        damping: 25
    });
    const buttonX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(maskX, {
        "EclipseButton.useTransform[buttonX]": (value)=>(value - 50) * 0.15
    }["EclipseButton.useTransform[buttonX]"]);
    const buttonY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])(maskY, {
        "EclipseButton.useTransform[buttonY]": (value)=>(value - 20) * 0.15
    }["EclipseButton.useTransform[buttonY]"]);
    const handleMouseMove = (e)=>{
        if (!buttonRef.current || disabled || isLoading) return;
        const rect = buttonRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };
    const variantStyles = {
        primary: {
            base: "bg-primary text-white border-primary",
            overlay: "bg-white text-primary"
        },
        outline: {
            base: "bg-transparent text-brand-black border-slate-200",
            overlay: "bg-primary text-white border-primary"
        },
        ghost: {
            base: "bg-transparent text-slate-600 border-transparent",
            overlay: "bg-slate-100 text-brand-black"
        },
        destructive: {
            base: "bg-red-600 text-white border-red-600",
            overlay: "bg-white text-red-600"
        }
    };
    const sizeStyles = {
        default: "h-12 px-8 text-sm",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12 p-0"
    };
    const currentVariant = variantStyles[variant];
    const label = text ?? (typeof children === "string" ? children : undefined);
    const renderContent = (isOverlay = false)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center", (label || children) && (leftIcon || rightIcon || isLoading) ? "gap-2" : ""),
            animate: {
                letterSpacing: isHovered && label ? "0.05em" : "0em",
                scale: isHovered ? 1.02 : 1
            },
            transition: {
                duration: 0.4,
                ease: [
                    0.16,
                    1,
                    0.3,
                    1
                ]
            },
            children: [
                isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "h-4 w-4 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                    lineNumber: 102,
                    columnNumber: 23
                }, ("TURBOPACK compile-time value", void 0)),
                !isLoading && leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center",
                    children: leftIcon
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                (label || children && !leftIcon && !rightIcon && !isLoading) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: label ?? children
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                !isLoading && rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center",
                    children: rightIcon
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                    lineNumber: 110,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    const clipPath = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"])([
        maskX,
        maskY
    ], {
        "EclipseButton.useTransform[clipPath]": ([x, y])=>{
            const xx = typeof x === "number" ? x : 0;
            const yy = typeof y === "number" ? y : 0;
            return isHovered ? `circle(100px at ${xx}px ${yy}px)` : "circle(0px at 50% 50%)";
        }
    }["EclipseButton.useTransform[clipPath]"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
        ref: (node)=>{
            buttonRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative isolate overflow-hidden rounded-full border font-bold uppercase tracking-widest", "inline-flex items-center justify-center", currentVariant.base, sizeStyles[size], "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", (disabled || isLoading) && "cursor-not-allowed opacity-60", className),
        style: {
            x: buttonX,
            y: buttonY
        },
        onMouseMove: handleMouseMove,
        onMouseEnter: ()=>setIsHovered(true),
        onMouseLeave: ()=>{
            setIsHovered(false);
            mouseX.set(0);
            mouseY.set(0);
        },
        disabled: disabled || isLoading,
        whileTap: {
            scale: 0.95
        },
        type: type,
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "absolute hidden",
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                    id: "eclipseNoiseFilter",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feTurbulence", {
                            type: "fractalNoise",
                            baseFrequency: "0.8",
                            numOctaves: "3",
                            stitchTiles: "stitch"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feColorMatrix", {
                            type: "matrix",
                            values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -2"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                            operator: "in",
                            in2: "SourceGraphic",
                            result: "monoNoise"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feBlend", {
                            in: "SourceGraphic",
                            in2: "monoNoise",
                            mode: "screen"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                    lineNumber: 156,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative z-10 pointer-events-none",
                children: renderContent()
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                lineNumber: 172,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 z-20 flex items-center justify-center", "pointer-events-none select-none", currentVariant.overlay, sizeStyles[size]),
                style: {
                    clipPath,
                    WebkitClipPath: clipPath
                },
                "aria-hidden": true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none",
                        style: {
                            filter: "url(#eclipseNoiseFilter)"
                        }
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    renderContent(true)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx",
        lineNumber: 127,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
}, "6DN41xVwv7SPhPhv0sw0xcHsUeM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
})), "6DN41xVwv7SPhPhv0sw0xcHsUeM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransform"]
    ];
});
_c1 = EclipseButton;
EclipseButton.displayName = "EclipseButton";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "EclipseButton$React.forwardRef");
__turbopack_context__.k.register(_c1, "EclipseButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RightPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
function formatDateLabel(iso) {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
function RightPanel({ todaySchedules, selectedDateStr, isAdmin, canAddSchedule }) {
    _s();
    const [notice, setNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [readByMe, setReadByMe] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [memos, setMemos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [memoContent, setMemoContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loadingNotice, setLoadingNotice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingMemos, setLoadingMemos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendingMemo, setSendingMemo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [popupOpen, setPopupOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedSchedule, setSelectedSchedule] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const todayStr = new Date().toISOString().slice(0, 10);
    const fetchNotice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RightPanel.useCallback[fetchNotice]": async ()=>{
            setLoadingNotice(true);
            try {
                const res = await fetch("/api/notices");
                const data = await res.json();
                if (res.ok) {
                    setNotice(data.notice ?? null);
                    setReadByMe(data.readByMe ?? false);
                }
            } catch  {
                setNotice(null);
                setReadByMe(false);
            } finally{
                setLoadingNotice(false);
            }
        }
    }["RightPanel.useCallback[fetchNotice]"], []);
    const fetchMemos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RightPanel.useCallback[fetchMemos]": async ()=>{
            setLoadingMemos(true);
            try {
                const res = await fetch(`/api/memos?date=${todayStr}`);
                const data = await res.json();
                if (res.ok) setMemos(data.memos ?? []);
            } catch  {
                setMemos([]);
            } finally{
                setLoadingMemos(false);
            }
        }
    }["RightPanel.useCallback[fetchMemos]"], [
        todayStr
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RightPanel.useEffect": ()=>{
            fetchNotice();
        }
    }["RightPanel.useEffect"], [
        fetchNotice
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RightPanel.useEffect": ()=>{
            fetchMemos();
        }
    }["RightPanel.useEffect"], [
        fetchMemos
    ]);
    const handleMemoSubmit = async (e)=>{
        e.preventDefault();
        if (!memoContent.trim() || sendingMemo) return;
        setError(null);
        setSendingMemo(true);
        try {
            const res = await fetch("/api/memos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: memoContent.trim()
                })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message ?? "메모 저장에 실패했습니다.");
                return;
            }
            setMemoContent("");
            fetchMemos();
        } catch  {
            setError("네트워크 오류로 메모 저장에 실패했습니다.");
        } finally{
            setSendingMemo(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-full lg:w-80 flex-shrink-0 bg-white border-l border-slate-200 flex flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 flex flex-col h-full overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 flex flex-col gap-2",
                        children: [
                            canAddSchedule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                type: "button",
                                variant: "primary",
                                size: "sm",
                                text: "일정추가",
                                className: "w-full",
                                onClick: ()=>router.push("/admin/schedules")
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setPopupOpen(true),
                                        className: "w-full text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase font-bold text-slate-400 mb-1",
                                                children: "공지사항"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 171,
                                                columnNumber: 15
                                            }, this),
                                            loadingNotice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500",
                                                children: "불러오는 중..."
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this) : notice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-brand-black line-clamp-2",
                                                children: notice.title
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 177,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-500",
                                                children: isAdmin ? "클릭하여 공지 작성" : "등록된 공지가 없습니다."
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 181,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    notice && readByMe && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 font-medium",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                "aria-hidden": true,
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 188,
                                                columnNumber: 17
                                            }, this),
                                            " 읽음"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 187,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-bold mb-3 text-brand-black",
                        children: selectedDateStr ? `${formatDateLabel(selectedDateStr)} 일정` : "오늘의 일정"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6 space-y-2 flex-shrink-0",
                        children: todaySchedules.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-brand-gray py-2",
                            children: "오늘 일정이 없습니다."
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this) : todaySchedules.map((s)=>{
                            const isDealer = s.category === "dealer";
                            const isInternal = s.category === "internal";
                            const isPersonal = s.category === "personal";
                            const isLeave = s.category === "leave";
                            const subParts = [];
                            if (isDealer && s.instructor) subParts.push(`교육자 ${s.instructor}`);
                            if (isInternal && s.target_audience) subParts.push(`대상자 ${s.target_audience}`);
                            if (isPersonal && s.location) subParts.push(s.location);
                            if (isLeave) subParts.push("월차");
                            if (s.is_all_day) {
                                subParts.push("종일");
                            } else {
                                subParts.push(`${formatTime(s.start_at)} - ${formatTime(s.end_at)}`);
                            }
                            const subText = subParts.join(" · ");
                            const colorClass = s.category === "dealer" ? "border-blue-500 bg-blue-50" : s.category === "internal" ? "border-purple-500 bg-purple-50" : s.category === "personal" ? "border-emerald-500 bg-emerald-50" : s.category === "leave" ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-slate-50";
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                draggable: isAdmin,
                                onDragStart: isAdmin ? (e)=>{
                                    const payload = JSON.stringify({
                                        id: s.id,
                                        start_at: s.start_at,
                                        end_at: s.end_at,
                                        is_all_day: s.is_all_day
                                    });
                                    e.dataTransfer.setData("application/json", payload);
                                    e.dataTransfer.setData("text/plain", payload);
                                    e.dataTransfer.effectAllowed = "move";
                                    e.dataTransfer.dropEffect = "move";
                                } : undefined,
                                className: `w-full text-left p-3 rounded-lg border border-slate-100 border-l-4 ${colorClass} ${isAdmin ? "cursor-grab active:cursor-grabbing" : ""}`,
                                onClick: ()=>setSelectedSchedule(s),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-brand-black",
                                        children: s.title
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 264,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-brand-gray mt-0.5",
                                        children: subText
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 267,
                                        columnNumber: 19
                                    }, this),
                                    s.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-600 mt-1 line-clamp-2",
                                        children: s.description
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 269,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, s.id, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 239,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-base font-bold mb-3 text-brand-black",
                        children: "메모"
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 rounded-lg border border-rose-500/40 bg-rose-500/5 px-2 py-1.5 text-xs text-rose-700",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleMemoSubmit,
                        className: "mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: memoContent,
                                onChange: (e)=>setMemoContent(e.target.value),
                                placeholder: "메모를 입력하세요...",
                                className: "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                                rows: 2,
                                disabled: sendingMemo
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                type: "submit",
                                disabled: sendingMemo || !memoContent.trim(),
                                isLoading: sendingMemo,
                                text: sendingMemo ? "저장 중..." : "작성",
                                variant: "primary",
                                className: "mt-1 w-full"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 295,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 286,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 overflow-y-auto min-h-0",
                        children: loadingMemos ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-brand-gray",
                            children: "불러오는 중..."
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                            lineNumber: 306,
                            columnNumber: 13
                        }, this) : memos.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2.5 rounded-lg border border-slate-100 bg-white text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-slate-800",
                                        children: m.content
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-brand-gray mt-1",
                                        children: [
                                            m.author_name ?? "알 수 없음",
                                            " · ",
                                            formatDateTime(m.created_at)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 314,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, m.id, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 309,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 304,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            popupOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NoticePopup, {
                notice: notice,
                isAdmin: isAdmin,
                onClose: ()=>setPopupOpen(false),
                onSaved: ()=>{
                    fetchNotice();
                    setPopupOpen(false);
                }
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                lineNumber: 324,
                columnNumber: 9
            }, this),
            selectedSchedule && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScheduleDetailPopup, {
                schedule: selectedSchedule,
                onClose: ()=>setSelectedSchedule(null)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                lineNumber: 335,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(RightPanel, "gwah9Y4Z4srv2p1vYO5J+EdDOwU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = RightPanel;
function ScheduleDetailPopup({ schedule, onClose }) {
    const isDealer = schedule.category === "dealer";
    const isInternal = schedule.category === "internal";
    const isPersonal = schedule.category === "personal";
    const isLeave = schedule.category === "leave";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
            onClick: (e)=>e.stopPropagation(),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-base font-bold text-brand-black",
                                children: schedule.title
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: onClose,
                                "aria-label": "일정 상세 닫기",
                                className: "!h-8 !w-8 !min-w-0 !p-0",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 370,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 366,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-brand-gray mb-3",
                        children: [
                            formatDateTime(schedule.start_at),
                            schedule.is_all_day ? " · 종일" : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    " ",
                                    "~ ",
                                    formatDateTime(schedule.end_at)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1.5 text-sm text-slate-800",
                        children: [
                            isDealer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    schedule.instructor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-brand-gray text-xs mr-1",
                                                children: "교육자"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 397,
                                                columnNumber: 21
                                            }, this),
                                            schedule.instructor
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 396,
                                        columnNumber: 19
                                    }, this),
                                    schedule.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-brand-gray text-xs mr-1",
                                                children: "장소"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 405,
                                                columnNumber: 21
                                            }, this),
                                            schedule.location
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 404,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            isInternal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    schedule.target_audience && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-brand-gray text-xs mr-1",
                                                children: "대상자"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 417,
                                                columnNumber: 21
                                            }, this),
                                            schedule.target_audience
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 416,
                                        columnNumber: 19
                                    }, this),
                                    schedule.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-brand-gray text-xs mr-1",
                                                children: "장소"
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 425,
                                                columnNumber: 21
                                            }, this),
                                            schedule.location
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 424,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            isPersonal && schedule.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-brand-gray text-xs mr-1",
                                        children: "장소"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this),
                                    schedule.location
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 434,
                                columnNumber: 15
                            }, this),
                            isLeave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-amber-700",
                                children: [
                                    schedule.title,
                                    " 매니저님의 월차 일정입니다."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 440,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 392,
                        columnNumber: 11
                    }, this),
                    schedule.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 pt-3 border-t border-slate-100 text-sm text-slate-700 whitespace-pre-wrap",
                        children: schedule.description
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 446,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                lineNumber: 365,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
            lineNumber: 361,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
        lineNumber: 357,
        columnNumber: 5
    }, this);
}
_c1 = ScheduleDetailPopup;
function NoticePopup({ notice, isAdmin, onClose, onSaved }) {
    _s1();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(notice ? "view" : isAdmin ? "create" : "view");
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(notice?.title ?? "");
    const [body, setBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(notice?.body ?? "");
    const [imageUrl, setImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(notice?.image_url ?? "");
    const [reads, setReads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [readDropdown, setReadDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const noticeId = notice?.id;
    const loadReads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NoticePopup.useCallback[loadReads]": async ()=>{
            if (!noticeId) return;
            const res = await fetch(`/api/notices/${noticeId}/reads`);
            const data = await res.json();
            if (res.ok) setReads(data.reads ?? []);
        }
    }["NoticePopup.useCallback[loadReads]"], [
        noticeId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NoticePopup.useEffect": ()=>{
            if (notice) {
                setTitle(notice.title);
                setBody(notice.body ?? "");
                setImageUrl(notice.image_url ?? "");
                setMode("view");
            } else if (isAdmin) {
                setMode("create");
                setTitle("");
                setBody("");
                setImageUrl("");
            }
        }
    }["NoticePopup.useEffect"], [
        notice,
        isAdmin
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NoticePopup.useEffect": ()=>{
            if (noticeId && mode === "view") loadReads();
        }
    }["NoticePopup.useEffect"], [
        noticeId,
        mode,
        loadReads
    ]);
    const handleConfirmRead = async ()=>{
        if (!noticeId) return;
        try {
            await fetch(`/api/notices/${noticeId}/read`, {
                method: "POST"
            });
            loadReads();
        } catch  {
        // ignore
        }
    };
    const handleImageSelect = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setError(null);
        setUploading(true);
        try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/notices/upload", {
                method: "POST",
                body: form
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message ?? "이미지 업로드에 실패했습니다.");
                return;
            }
            setImageUrl(data.url ?? "");
        } catch  {
            setError("이미지 업로드 중 오류가 발생했습니다.");
        } finally{
            setUploading(false);
        }
    };
    const handleSave = async ()=>{
        setError(null);
        setSaving(true);
        try {
            if (mode === "create") {
                const res = await fetch("/api/notices", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        body: body.trim() || null,
                        imageUrl: imageUrl || null
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message ?? "저장에 실패했습니다.");
                    return;
                }
                onSaved();
                return;
            }
            if (mode === "edit" && noticeId) {
                const res = await fetch(`/api/notices/${noticeId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        body: body.trim() || null,
                        imageUrl: imageUrl || null
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message ?? "수정에 실패했습니다.");
                    return;
                }
                onSaved();
            }
        } catch  {
            setError("네트워크 오류가 발생했습니다.");
        } finally{
            setSaving(false);
        }
    };
    const showForm = mode === "edit" || mode === "create";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto",
            onClick: (e)=>e.stopPropagation(),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-brand-black",
                                children: showForm ? mode === "create" ? "공지 작성" : "공지 수정" : "공지사항"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 597,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                type: "button",
                                variant: "ghost",
                                size: "icon",
                                onClick: onClose,
                                "aria-label": "닫기",
                                className: "!h-8 !w-8 !min-w-0 !p-0",
                                children: "×"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 600,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 596,
                        columnNumber: 11
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-3 rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-700",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                        lineNumber: 613,
                        columnNumber: 13
                    }, this),
                    showForm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-slate-700 mb-1",
                                children: "제목"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 620,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: title,
                                onChange: (e)=>setTitle(e.target.value),
                                className: "w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 focus:ring-2 focus:ring-primary/30",
                                placeholder: "제목"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 623,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-slate-700 mb-1",
                                children: "본문"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 630,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: body,
                                onChange: (e)=>setBody(e.target.value),
                                className: "w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 resize-none focus:ring-2 focus:ring-primary/30",
                                rows: 4,
                                placeholder: "내용"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 633,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-slate-700 mb-1",
                                children: "이미지 첨부"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 640,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "file",
                                accept: "image/jpeg,image/png,image/gif,image/webp",
                                onChange: handleImageSelect,
                                disabled: uploading,
                                className: "mb-2 block w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary file:text-sm"
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 643,
                                columnNumber: 15
                            }, this),
                            uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-brand-gray mb-2",
                                children: "업로드 중..."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 651,
                                columnNumber: 17
                            }, this),
                            imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: imageUrl,
                                        alt: "첨부",
                                        className: "max-h-40 rounded-lg border border-slate-200"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 655,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                        type: "button",
                                        variant: "destructive",
                                        size: "sm",
                                        text: "이미지 제거",
                                        onClick: ()=>setImageUrl(""),
                                        className: "mt-1"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 660,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 654,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                        type: "button",
                                        onClick: handleSave,
                                        disabled: saving || !title.trim(),
                                        isLoading: saving,
                                        text: saving ? "저장 중..." : "저장",
                                        variant: "primary",
                                        className: "flex-1"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 671,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                        type: "button",
                                        variant: "outline",
                                        text: "취소",
                                        onClick: ()=>notice ? setMode("view") : onClose()
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 680,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 670,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            notice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-base font-semibold text-brand-black mb-2",
                                        children: notice.title
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 692,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-slate-700 whitespace-pre-wrap mb-4",
                                        children: notice.body || "내용 없음"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 695,
                                        columnNumber: 19
                                    }, this),
                                    notice.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: notice.image_url,
                                        alt: "첨부",
                                        className: "mb-4 max-h-48 rounded-lg border border-slate-200 w-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 699,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-bold text-slate-500 uppercase",
                                                        children: "확인한 사람"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                        lineNumber: 709,
                                                        columnNumber: 23
                                                    }, this),
                                                    reads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                                        type: "button",
                                                        variant: "ghost",
                                                        size: "sm",
                                                        text: readDropdown ? "접기" : "목록 보기",
                                                        onClick: ()=>setReadDropdown((v)=>!v),
                                                        className: "!normal-case !tracking-normal text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                        lineNumber: 713,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 708,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1",
                                                children: reads.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        title: `${r.full_name ?? "이름 없음"} · ${new Date(r.read_at).toLocaleString("ko-KR")}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex w-8 h-8 rounded-full bg-primary/20 text-primary items-center justify-center text-xs font-bold border-2 border-white shadow cursor-default",
                                                                children: (r.full_name ?? "?")[0]
                                                            }, void 0, false, {
                                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                                lineNumber: 730,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "hidden group-hover:block absolute left-0 top-full mt-1 z-20 py-1.5 px-2 rounded-lg bg-slate-800 text-white text-xs shadow whitespace-nowrap",
                                                                children: [
                                                                    r.full_name ?? "이름 없음",
                                                                    " ·",
                                                                    " ",
                                                                    new Date(r.read_at).toLocaleString("ko-KR")
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                                lineNumber: 733,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, r.profile_id, true, {
                                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 723,
                                                columnNumber: 21
                                            }, this),
                                            readDropdown && reads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1",
                                                role: "list",
                                                children: reads.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            r.full_name ?? "이름 없음",
                                                            " ·",
                                                            " ",
                                                            new Date(r.read_at).toLocaleString("ko-KR")
                                                        ]
                                                    }, r.profile_id, true, {
                                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                        lineNumber: 746,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 741,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 707,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                                type: "button",
                                                variant: "outline",
                                                text: "확인했어요",
                                                onClick: handleConfirmRead
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 756,
                                                columnNumber: 21
                                            }, this),
                                            isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                                type: "button",
                                                variant: "ghost",
                                                text: "수정",
                                                onClick: ()=>setMode("edit")
                                            }, void 0, false, {
                                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                                lineNumber: 763,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                        lineNumber: 755,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true),
                            !notice && !isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-brand-gray",
                                children: "등록된 공지가 없습니다."
                            }, void 0, false, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                                lineNumber: 774,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
                lineNumber: 595,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
            lineNumber: 591,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx",
        lineNumber: 590,
        columnNumber: 5
    }, this);
}
_s1(NoticePopup, "6keihEq/FeOoK+BV3nyu+G7x3ns=");
_c2 = NoticePopup;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "RightPanel");
__turbopack_context__.k.register(_c1, "ScheduleDetailPopup");
__turbopack_context__.k.register(_c2, "NoticePopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BranchMembersCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function BranchMembersCard() {
    _s();
    const [managers, setManagers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BranchMembersCard.useEffect": ()=>{
            const load = {
                "BranchMembersCard.useEffect.load": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const res = await fetch("/api/admin/managers");
                        const data = await res.json();
                        if (!res.ok) {
                            setError(data.message ?? "매니저 목록을 불러오지 못했습니다.");
                            return;
                        }
                        setManagers(data.managers ?? []);
                    } catch  {
                        setError("네트워크 오류로 매니저 목록을 불러오지 못했습니다.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["BranchMembersCard.useEffect.load"];
            load();
        }
    }["BranchMembersCard.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-[85vw] snap-center bg-white border border-slate-200 rounded-xl shadow-sm p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-sm font-bold mb-3 text-brand-black",
                children: "Branch Members"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-brand-gray",
                children: "불러오는 중..."
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-rose-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this) : managers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-brand-gray",
                children: "등록된 매니저가 없습니다."
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3 text-sm",
                children: managers.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-semibold text-slate-700",
                                        children: m.name[0] ?? "?"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                        lineNumber: 54,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold text-brand-black",
                                        children: m.name
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                        lineNumber: 60,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[11px] text-brand-gray",
                                        children: [
                                            m.branch_name ?? "지점 미지정",
                                            " ·",
                                            " ",
                                            m.role === "admin" ? "Admin" : "Manager"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                        lineNumber: 63,
                                        columnNumber: 17
                                    }, this),
                                    m.phone_number && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-400 mt-0.5",
                                        children: m.phone_number
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                        lineNumber: 68,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                                lineNumber: 59,
                                columnNumber: 15
                            }, this)
                        ]
                    }, m.id, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                        lineNumber: 52,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/BranchMembersCard.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(BranchMembersCard, "7g8q7EHRX3FyLjc5Hs4ahqgCEec=");
_c = BranchMembersCard;
var _c;
__turbopack_context__.k.register(_c, "BranchMembersCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeftPanelBranchMembers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
/** Admin을 맨 위로 정렬한 목록 반환 */ function sortAdminFirst(members) {
    return [
        ...members
    ].sort((a, b)=>{
        if (a.role === "admin" && b.role !== "admin") return -1;
        if (a.role !== "admin" && b.role === "admin") return 1;
        return 0;
    });
}
function statusDotColor(role) {
    if (role === "admin") return "bg-green-500";
    if (role === "manager") return "bg-yellow-500";
    return "bg-slate-300";
}
function roleLabel(role) {
    if (role === "admin") return "Admin";
    if (role === "manager") return "Manager";
    return "Agent";
}
function LeftPanelBranchMembers() {
    _s();
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeftPanelBranchMembers.useEffect": ()=>{
            const load = {
                "LeftPanelBranchMembers.useEffect.load": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const res = await fetch("/api/admin/managers");
                        const data = await res.json();
                        if (!res.ok) {
                            setError(data.message ?? "목록을 불러오지 못했습니다.");
                            return;
                        }
                        const list = data.managers ?? [];
                        setMembers(sortAdminFirst(list));
                    } catch  {
                        setError("네트워크 오류로 목록을 불러오지 못했습니다.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["LeftPanelBranchMembers.useEffect.load"];
            load();
        }
    }["LeftPanelBranchMembers.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pt-8 pb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "px-3 text-[10px] uppercase font-bold tracking-wider text-brand-gray mb-4",
                children: "Branch Members"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 text-sm",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-3 text-xs text-brand-gray",
                    children: "불러오는 중..."
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-3 text-xs text-rose-600",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                    lineNumber: 71,
                    columnNumber: 11
                }, this) : members.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "px-3 text-xs text-brand-gray",
                    children: "등록된 멤버가 없습니다."
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                    lineNumber: 73,
                    columnNumber: 11
                }, this) : members.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 px-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700",
                                        children: m.name?.[0] ?? "?"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                        lineNumber: 78,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${statusDotColor(m.role)}`
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                        lineNumber: 81,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                lineNumber: 77,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold truncate text-brand-black",
                                        children: m.name
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                        lineNumber: 86,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-brand-gray",
                                        children: roleLabel(m.role)
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                                lineNumber: 85,
                                columnNumber: 15
                            }, this)
                        ]
                    }, m.id, true, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                        lineNumber: 76,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/LeftPanelBranchMembers.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_s(LeftPanelBranchMembers, "q0PmmTMdyXjbszVg9imEXB31K+4=");
_c = LeftPanelBranchMembers;
var _c;
__turbopack_context__.k.register(_c, "LeftPanelBranchMembers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/interactive-animated-arrow-icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IntIcon",
    ()=>IntIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$lottie$2d$web$2f$build$2f$player$2f$lottie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/lottie-web/build/player/lottie.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function IntIcon({ animationData, autoplay = false, loop = false, onClick, onMouseEnter, onMouseLeave, playOnClick = false, toggleDirectionOnClick = false, playDirectionOnEnter = null, playDirectionOnLeave = null, color = null, size = 100, className }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animationInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [directionForward, setDirectionForward] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [resolvedAnimationData, setResolvedAnimationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const sizeStyle = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "IntIcon.useMemo[sizeStyle]": ()=>{
            if (typeof size === "number") return `${size}px`;
            return size;
        }
    }["IntIcon.useMemo[sizeStyle]"], [
        size
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IntIcon.useEffect": ()=>{
            if (!animationData) return;
            if (typeof animationData === "string") {
                fetch(animationData).then({
                    "IntIcon.useEffect": (res)=>res.json()
                }["IntIcon.useEffect"]).then({
                    "IntIcon.useEffect": (data)=>setResolvedAnimationData(data)
                }["IntIcon.useEffect"]).catch({
                    "IntIcon.useEffect": (err)=>{
                        console.error("Failed to load Lottie JSON from URL:", err);
                    }
                }["IntIcon.useEffect"]);
            } else {
                setResolvedAnimationData(animationData);
            }
        }
    }["IntIcon.useEffect"], [
        animationData
    ]);
    const applyColor = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "IntIcon.useCallback[applyColor]": (colorValue)=>{
            if (!animationInstance.current || !containerRef.current) return;
            const svgElement = containerRef.current.querySelector("svg");
            if (!svgElement) return;
            const hex = colorValue === "black" ? "#000000" : "#FFFFFF";
            const elements = svgElement.querySelectorAll("path, circle, rect, ellipse, polygon, line, polyline");
            elements.forEach({
                "IntIcon.useCallback[applyColor]": (el)=>{
                    if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") {
                        el.style.fill = hex;
                    }
                    if (el.getAttribute("stroke") && el.getAttribute("stroke") !== "none") {
                        el.style.stroke = hex;
                    }
                }
            }["IntIcon.useCallback[applyColor]"]);
        }
    }["IntIcon.useCallback[applyColor]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IntIcon.useEffect": ()=>{
            if (!containerRef.current || !resolvedAnimationData) return;
            animationInstance.current = __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$lottie$2d$web$2f$build$2f$player$2f$lottie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].loadAnimation({
                container: containerRef.current,
                renderer: "svg",
                loop,
                autoplay,
                animationData: resolvedAnimationData
            });
            if (color && (color === "black" || color === "white")) {
                animationInstance.current.addEventListener("DOMLoaded", {
                    "IntIcon.useEffect": ()=>{
                        applyColor(color);
                    }
                }["IntIcon.useEffect"]);
            }
            animationInstance.current.addEventListener("complete", {
                "IntIcon.useEffect": ()=>{
                    setIsPlaying(false);
                }
            }["IntIcon.useEffect"]);
            return ({
                "IntIcon.useEffect": ()=>{
                    if (animationInstance.current) {
                        animationInstance.current.removeEventListener("complete");
                        animationInstance.current.destroy();
                    }
                }
            })["IntIcon.useEffect"];
        }
    }["IntIcon.useEffect"], [
        resolvedAnimationData,
        autoplay,
        loop,
        color,
        applyColor
    ]);
    const handleClick = (e)=>{
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
    const handleMouseEnter = (e)=>{
        if (animationInstance.current && playDirectionOnEnter !== null) {
            animationInstance.current.setDirection(playDirectionOnEnter);
            animationInstance.current.play();
            setIsPlaying(true);
        }
        onMouseEnter?.(e);
    };
    const handleMouseLeave = (e)=>{
        if (animationInstance.current && playDirectionOnLeave !== null) {
            animationInstance.current.setDirection(playDirectionOnLeave);
            animationInstance.current.play();
            setIsPlaying(true);
        }
        onMouseLeave?.(e);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: className,
        style: {
            cursor: "pointer",
            display: "inline-block",
            width: sizeStyle,
            height: sizeStyle
        },
        role: "button",
        tabIndex: 0,
        onKeyDown: (e)=>{
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(e);
            }
        },
        children: !resolvedAnimationData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "text-muted-foreground text-xs",
            children: "Loading…"
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/interactive-animated-arrow-icon.tsx",
            lineNumber: 174,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/interactive-animated-arrow-icon.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_s(IntIcon, "19/rsAqdkpBYyU0koqfeT/NH3pU=");
_c = IntIcon;
var _c;
__turbopack_context__.k.register(_c, "IntIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DesktopRightPanelProvider",
    ()=>DesktopRightPanelProvider,
    "default",
    ()=>RightPanelCollapseWrapper,
    "useRightPanel",
    ()=>useRightPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$interactive$2d$animated$2d$arrow$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/interactive-animated-arrow-icon.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const ARROW_RIGHT_CIRCLE_LOTTIE = "https://res.cloudinary.com/dhdupwqli/raw/upload/arrowRightCircle_zf9kg7.json";
const RightPanelContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useRightPanel() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(RightPanelContext);
}
_s(useRightPanel, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function DesktopRightPanelProvider({ children }) {
    _s1();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RightPanelContext.Provider, {
        value: {
            open,
            setOpen
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s1(DesktopRightPanelProvider, "dVkDIfRb5RN4FjtonjBYYwpg89o=");
_c = DesktopRightPanelProvider;
function RightPanelCollapseWrapper({ children }) {
    _s2();
    const ctx = useRightPanel();
    const open = ctx?.open ?? true;
    const setOpen = ctx?.setOpen ?? (()=>{});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-0 flex-shrink-0 self-stretch relative pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-auto rounded-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
                    role: "button",
                    tabIndex: 0,
                    "aria-label": "우측 패널 닫기",
                    onKeyDown: (e)=>{
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setOpen(false);
                        }
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$interactive$2d$animated$2d$arrow$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IntIcon"], {
                        animationData: ARROW_RIGHT_CIRCLE_LOTTIE,
                        color: "black",
                        playOnClick: true,
                        size: 40,
                        autoplay: true,
                        onClick: ()=>setOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
                        lineNumber: 56,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
                    lineNumber: 44,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-out ${open ? "w-80" : "w-0"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative w-80 h-full transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`,
                    children: children
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s2(RightPanelCollapseWrapper, "42/BDD0HkKq0vukcVNMl0JrA3gs=", false, function() {
    return [
        useRightPanel
    ];
});
_c1 = RightPanelCollapseWrapper;
var _c, _c1;
__turbopack_context__.k.register(_c, "DesktopRightPanelProvider");
__turbopack_context__.k.register(_c1, "RightPanelCollapseWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DesktopShellHamburger",
    ()=>DesktopShellHamburger,
    "default",
    ()=>DesktopShell,
    "useDesktopShell",
    ()=>useDesktopShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
const ShellContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function useDesktopShell() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ShellContext);
    return ctx;
}
_s(useDesktopShell, "/dMy7t63NXD4eYACoT93CePwGrg=");
function DesktopShellHamburger() {
    _s1();
    const ctx = useDesktopShell();
    if (!ctx) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
        type: "button",
        variant: "ghost",
        size: "icon",
        onClick: ()=>ctx.setLeftOpen(!ctx.leftOpen),
        "aria-label": ctx.leftOpen ? "메뉴 닫기" : "메뉴 열기",
        className: "!h-9 !w-9 !min-w-0 !p-0 !normal-case !tracking-normal",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex flex-col justify-center gap-1",
            "aria-hidden": true,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block w-4 h-0.5 bg-slate-600 mx-auto rounded"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block w-4 h-0.5 bg-slate-600 mx-auto rounded"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "block w-4 h-0.5 bg-slate-600 mx-auto rounded"
                }, void 0, false, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s1(DesktopShellHamburger, "Alqsazc8tEe6d655x+lYoNIr6tw=", false, function() {
    return [
        useDesktopShell
    ];
});
_c = DesktopShellHamburger;
function DesktopShell({ leftPanel, children }) {
    _s2();
    const [leftOpen, setLeftOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShellContext.Provider, {
        value: {
            leftOpen,
            setLeftOpen
        },
        children: [
            leftOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                "aria-label": "메뉴 닫기",
                className: "fixed inset-0 z-40 bg-black/20",
                onClick: ()=>setLeftOpen(false)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `fixed top-0 left-0 bottom-0 w-72 bg-white border-r border-slate-200 flex flex-col z-50 shadow-xl transition-transform duration-200 ease-out ${leftOpen ? "translate-x-0" : "-translate-x-full"}`,
                onMouseLeave: ()=>setLeftOpen(false),
                children: leftPanel
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex min-w-0 overflow-hidden",
                children: children
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DesktopShell.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_s2(DesktopShell, "ktYsoCjMSHAeY0jXUuripynEojc=");
_c1 = DesktopShell;
var _c, _c1;
__turbopack_context__.k.register(_c, "DesktopShellHamburger");
__turbopack_context__.k.register(_c1, "DesktopShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarMonthNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarMonthNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function CalendarMonthNav({ year, month }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const label = `${String(year).slice(2)}.${String(month + 1).padStart(2, "0")}`;
    const go = (y, m)=>{
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.set("year", String(y));
        params.set("month", String(m + 1));
        router.push(`/?${params.toString()}`);
    };
    const goToday = ()=>{
        const now = new Date();
        go(now.getFullYear(), now.getMonth());
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: ()=>go(prevYear, prevMonth),
                "aria-label": "이전 달",
                className: "!h-8 !w-8 !min-w-0 !p-0",
                children: "<"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarMonthNav.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                type: "button",
                variant: "ghost",
                size: "sm",
                text: label,
                onClick: goToday,
                "aria-label": "현재 달로 이동",
                className: "min-w-[3.5rem] !normal-case !tracking-normal font-calendar"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarMonthNav.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                type: "button",
                variant: "ghost",
                size: "icon",
                onClick: ()=>go(nextYear, nextMonth),
                "aria-label": "다음 달",
                className: "!h-8 !w-8 !min-w-0 !p-0",
                children: ">"
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarMonthNav.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarMonthNav.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
_s(CalendarMonthNav, "A57ZQKsSKoH4xi482IWIv7kTTfs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = CalendarMonthNav;
var _c;
__turbopack_context__.k.register(_c, "CalendarMonthNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarCellDropZone.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarCellDropZone
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function CalendarCellDropZone({ dateISO, isEmpty, className, children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarCellDropZone.useCallback[handleDragOver]": (e)=>{
            if (isEmpty || !dateISO) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setIsDragOver(true);
        }
    }["CalendarCellDropZone.useCallback[handleDragOver]"], [
        isEmpty,
        dateISO
    ]);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarCellDropZone.useCallback[handleDragLeave]": (e)=>{
            e.preventDefault();
            setIsDragOver(false);
        }
    }["CalendarCellDropZone.useCallback[handleDragLeave]"], []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarCellDropZone.useCallback[handleDrop]": async (e)=>{
            if (isEmpty || !dateISO) return;
            e.preventDefault();
            setIsDragOver(false);
            let raw = e.dataTransfer.getData("application/json");
            if (!raw) raw = e.dataTransfer.getData("text/plain");
            if (!raw) return;
            let payload;
            try {
                payload = JSON.parse(raw);
            } catch  {
                return;
            }
            if (!payload.id || !payload.start_at || !payload.end_at) return;
            // 로컬 날짜 기준으로 변환 (UTC만 쓰면 타임존에 따라 하루 밀림)
            const [y, m, d] = dateISO.slice(0, 10).split("-").map(Number);
            let newStartAt;
            let newEndAt;
            if (payload.is_all_day) {
                const localStart = new Date(y, m - 1, d, 0, 0, 0, 0);
                const localEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
                newStartAt = localStart.toISOString();
                newEndAt = localEnd.toISOString();
            } else {
                const origStart = new Date(payload.start_at);
                const origEnd = new Date(payload.end_at);
                const localStart = new Date(y, m - 1, d, origStart.getHours(), origStart.getMinutes(), origStart.getSeconds(), origStart.getMilliseconds());
                const localEnd = new Date(y, m - 1, d, origEnd.getHours(), origEnd.getMinutes(), origEnd.getSeconds(), origEnd.getMilliseconds());
                newStartAt = localStart.toISOString();
                newEndAt = localEnd.toISOString();
            }
            const res = await fetch(`/api/schedules/${payload.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    startAt: newStartAt,
                    endAt: newEndAt
                })
            });
            if (res.ok) router.refresh();
        }
    }["CalendarCellDropZone.useCallback[handleDrop]"], [
        dateISO,
        isEmpty,
        router
    ]);
    if (isEmpty || !dateISO) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: className,
            children: children
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarCellDropZone.tsx",
            lineNumber: 110,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${className} ${isDragOver ? "ring-2 ring-primary bg-primary/10" : ""}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        role: "button",
        tabIndex: 0,
        "aria-label": `${dateISO.slice(0, 10)}로 일정 놓기`,
        children: children
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarCellDropZone.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(CalendarCellDropZone, "MU6eSZdn+iWOqgcdyR7nbFhsuHA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CalendarCellDropZone;
var _c;
__turbopack_context__.k.register(_c, "CalendarCellDropZone");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/DraggableSchedulePill.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DraggableSchedulePill
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
"use client";
;
const CATEGORY_CLASSES = {
    dealer: "border-blue-500 bg-blue-50 text-blue-800",
    internal: "border-purple-500 bg-purple-50 text-purple-800",
    personal: "border-emerald-500 bg-emerald-50 text-emerald-800",
    leave: "border-amber-500 bg-amber-50 text-amber-800",
    etc: "border-slate-300 bg-slate-50 text-slate-700"
};
function DraggableSchedulePill({ schedule, isAdmin, className = "text-[10px] p-1.5 border-l-2 rounded truncate" }) {
    const colorClass = schedule.category && CATEGORY_CLASSES[schedule.category] || CATEGORY_CLASSES.etc;
    const baseClass = `${className} ${colorClass}`;
    if (!isAdmin) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: baseClass,
            children: schedule.title
        }, void 0, false, {
            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DraggableSchedulePill.tsx",
            lineNumber: 35,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        draggable: true,
        onDragStart: (e)=>{
            const payload = JSON.stringify({
                id: schedule.id,
                start_at: schedule.start_at,
                end_at: schedule.end_at,
                is_all_day: schedule.is_all_day
            });
            e.dataTransfer.setData("application/json", payload);
            e.dataTransfer.setData("text/plain", payload);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.dropEffect = "move";
        },
        className: `${baseClass} cursor-grab active:cursor-grabbing`,
        children: schedule.title
    }, void 0, false, {
        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/DraggableSchedulePill.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = DraggableSchedulePill;
var _c;
__turbopack_context__.k.register(_c, "DraggableSchedulePill");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CalendarGridClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$CalendarCellDropZone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarCellDropZone.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$DraggableSchedulePill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/DraggableSchedulePill.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$RightPanelCollapseWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/RightPanelCollapseWrapper.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/GA_NEXUS/app/components/ui/EclipseButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function CalendarGridClient({ cells, eventsByDay, year, month, isAdmin, columns, selectedDateStr, todayStr }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const rightPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$RightPanelCollapseWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRightPanel"])();
    const [quickDateISO, setQuickDateISO] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quickTitle, setQuickTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [quickContent, setQuickContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [quickSaving, setQuickSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quickError, setQuickError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleCellClick = (dateISO)=>{
        if (!dateISO) return;
        const params = new URLSearchParams();
        params.set("year", String(year));
        params.set("month", String(month + 1));
        params.set("date", dateISO);
        router.push(`/?${params.toString()}`);
        rightPanel?.setOpen(true);
    };
    const weekdays = columns === 5 ? [
        "월",
        "화",
        "수",
        "목",
        "금"
    ] : [
        "일",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토"
    ];
    const handleQuickSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarGridClient.useCallback[handleQuickSubmit]": async (e)=>{
            e.preventDefault();
            if (!quickDateISO || !quickTitle.trim() || quickSaving) return;
            setQuickError(null);
            setQuickSaving(true);
            try {
                const [y, m, d] = quickDateISO.split("-").map(Number);
                const localStart = new Date(y, m - 1, d, 0, 0, 0, 0);
                const localEnd = new Date(y, m - 1, d, 23, 59, 59, 999);
                const res = await fetch("/api/schedules", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        title: quickTitle.trim(),
                        description: quickContent.trim() || null,
                        startAt: localStart.toISOString(),
                        endAt: localEnd.toISOString(),
                        isAllDay: true,
                        category: "etc"
                    })
                });
                const data = await res.json();
                if (!res.ok) {
                    setQuickError(data.message ?? "일정 추가에 실패했습니다.");
                    return;
                }
                setQuickDateISO(null);
                setQuickTitle("");
                setQuickContent("");
                router.refresh();
            } catch  {
                setQuickError("네트워크 오류가 발생했습니다.");
            } finally{
                setQuickSaving(false);
            }
        }
    }["CalendarGridClient.useCallback[handleQuickSubmit]"], [
        quickDateISO,
        quickTitle,
        quickContent,
        quickSaving,
        router
    ]);
    const closeQuick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CalendarGridClient.useCallback[closeQuick]": ()=>{
            if (!quickSaving) {
                setQuickDateISO(null);
                setQuickTitle("");
                setQuickContent("");
                setQuickError(null);
            }
        }
    }["CalendarGridClient.useCallback[closeQuick]"], [
        quickSaving
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid ${columns === 5 ? "grid-cols-5" : "grid-cols-7"} bg-slate-50 border-b border-slate-200 font-calendar`,
                children: weekdays.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "py-3 text-center text-xs font-bold uppercase text-slate-400",
                        children: d
                    }, d, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `grid ${columns === 5 ? "grid-cols-5" : "grid-cols-7"} flex-1`,
                children: cells.map((cell)=>{
                    const events = cell.day !== null ? eventsByDay[String(cell.day)] ?? [] : [];
                    let dayColor = "text-slate-800";
                    let dayWeight = "font-normal";
                    if (cell.isToday) {
                        dayColor = "text-brand-black";
                        dayWeight = "font-bold";
                    } else if (cell.isSunday || cell.isHoliday) {
                        dayColor = "text-red-500";
                    } else if (cell.isSaturday) {
                        dayColor = "text-blue-500";
                    }
                    const isSelected = cell.dateISO === selectedDateStr;
                    const isTodayHighlight = cell.isToday && (!selectedDateStr || selectedDateStr === todayStr);
                    const redBorder = isSelected || isTodayHighlight;
                    const borderClass = redBorder ? "border-2 border-primary bg-primary/5 relative" : "border border-slate-100";
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$CalendarCellDropZone$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        dateISO: cell.dateISO,
                        isEmpty: cell.day === null,
                        className: `p-2 min-h-[70px] lg:min-h-[120px] cursor-pointer ${borderClass}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            role: "button",
                            tabIndex: 0,
                            onClick: ()=>handleCellClick(cell.dateISO),
                            onKeyDown: (e)=>{
                                if (e.key === "Enter" || e.key === " ") handleCellClick(cell.dateISO);
                            },
                            className: "w-full h-full text-left flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-h-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `font-calendar text-sm ${dayWeight} ${dayColor}`,
                                            children: cell.day ?? ""
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 171,
                                            columnNumber: 19
                                        }, this),
                                        cell.day !== null && events.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 space-y-1",
                                            onClick: (e)=>e.stopPropagation(),
                                            children: [
                                                events.slice(0, 3).map((ev)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$DraggableSchedulePill$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        schedule: {
                                                            id: ev.id,
                                                            title: ev.title,
                                                            start_at: ev.start_at,
                                                            end_at: ev.end_at,
                                                            is_all_day: ev.is_all_day,
                                                            category: ev.category
                                                        },
                                                        isAdmin: isAdmin
                                                    }, ev.id, false, {
                                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 23
                                                    }, this)),
                                                events.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-[9px] text-brand-gray",
                                                    children: [
                                                        "+ ",
                                                        events.length - 3,
                                                        "개 더보기"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 175,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                    lineNumber: 170,
                                    columnNumber: 17
                                }, this),
                                cell.day !== null && redBorder && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-auto pt-1 flex justify-end",
                                    onClick: (e)=>e.stopPropagation(),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                        type: "button",
                                        variant: "outline",
                                        size: "icon",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            setQuickDateISO(cell.dateISO);
                                            setQuickTitle("");
                                            setQuickContent("");
                                            setQuickError(null);
                                        },
                                        "aria-label": "퀵일정 추가",
                                        className: "!h-7 !w-7 !min-w-0 !p-0",
                                        children: "+"
                                    }, void 0, false, {
                                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                        lineNumber: 200,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                    lineNumber: 199,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this)
                    }, cell.key, false, {
                        fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                        lineNumber: 155,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            quickDateISO && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40",
                onClick: closeQuick,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm p-5",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-base font-bold text-brand-black mb-4",
                            children: "퀵일정"
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        quickError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-3 text-xs text-rose-600",
                            children: quickError
                        }, void 0, false, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleQuickSubmit,
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-600 mb-1",
                                            children: "일정"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 236,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: quickTitle,
                                            onChange: (e)=>setQuickTitle(e.target.value),
                                            placeholder: "제목",
                                            className: "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary",
                                            required: true,
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 237,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-medium text-slate-600 mb-1",
                                            children: "내용"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 248,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: quickContent,
                                            onChange: (e)=>setQuickContent(e.target.value),
                                            placeholder: "내용 (선택)",
                                            className: "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                                            rows: 3
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 249,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                            type: "button",
                                            variant: "outline",
                                            size: "sm",
                                            text: "취소",
                                            onClick: closeQuick,
                                            disabled: quickSaving,
                                            className: "flex-1"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 258,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$ui$2f$EclipseButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EclipseButton"], {
                                            type: "submit",
                                            disabled: quickSaving || !quickTitle.trim(),
                                            isLoading: quickSaving,
                                            text: quickSaving ? "저장 중..." : "추가",
                                            variant: "primary",
                                            size: "sm",
                                            className: "flex-1"
                                        }, void 0, false, {
                                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                            lineNumber: 267,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                                    lineNumber: 257,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                            lineNumber: 234,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/OneDrive/Desktop/GA_NEXUS/app/components/CalendarGridClient.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(CalendarGridClient, "eV//MX2Wy2PcOMlphbi4atU663Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$GA_NEXUS$2f$app$2f$components$2f$RightPanelCollapseWrapper$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRightPanel"]
    ];
});
_c = CalendarGridClient;
var _c;
__turbopack_context__.k.register(_c, "CalendarGridClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=OneDrive_Desktop_GA_NEXUS_efd4579b._.js.map