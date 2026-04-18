// src/components/ui/CollapsibleItem.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RxPlus } from "react-icons/rx";
import { formatDate } from "@/lib/format";
import { Duration } from "@/types";

export interface CollapsibleItemProps {
    /** Rendered in the always-visible header row */
    header: React.ReactNode;
    /** Rendered inside the animated expand panel */
    children: React.ReactNode;
    isActive: boolean;
    onToggle: () => void;
    /** 1-based display index, rendered as "01." prefix */
    index: number;
    /** If provided, renders the vertical date timeline on the right edge */
    duration?: Duration;
    className?: string;
}

export default function CollapsibleItem({
    header,
    children,
    isActive,
    onToggle,
    index,
    duration,
    className = "",
}: CollapsibleItemProps) {
    return (
        <div className={`w-full border-b border-current ${className}`}>
            {/* ── Header row ─────────────────────────────────────────────── */}
            <div
                className={`flex items-center justify-between px-1 py-3 md:py-5 md:px-4 ${!isActive && "cursor-pointer"
                    }`}
                onClick={() => !isActive && onToggle()}
            >
                <div className="flex items-start md:items-center gap-3 md:gap-5 flex-1 min-w-0">
                    {/* Index number */}
                    <div className="flex-shrink-0 flex items-center text-2xl md:text-4xl lg:text-5xl font-thin">
                        {(index + 1).toString().padStart(2, "0")}.
                    </div>

                    {/* Caller-supplied header content */}
                    <div className="flex-1 min-w-0">{header}</div>
                </div>

                {/* Toggle button */}
                <motion.button
                    className="relative ml-3 flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    aria-label={isActive ? "Collapse" : "Expand"}
                    initial={false}
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <RxPlus className="h-6 w-6 flex-shrink-0 md:h-8 md:w-8" />
                </motion.button>
            </div>

            {/* ── Expand panel ───────────────────────────────────────────── */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        key="content"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                    >
                        {/* Relative wrapper so the timeline can be absolutely positioned */}
                        <div className="relative">
                            {children}

                            {/* ── Date timeline ──────────────────────────── */}
                            {duration && (
                                <div className="absolute pb-6 md:pb-8 right-2 md:right-6 lg:right-8 top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none">
                                    {duration.start && (
                                        <span className="[writing-mode:vertical-rl] text-orientation-mixed text-sm whitespace-nowrap">
                                            {formatDate(duration.start, "Mon YYYY").toUpperCase()}
                                        </span>)}

                                    <motion.div
                                        className="my-2.5 h-full w-0.5 flex-grow origin-top bg-current"
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        exit={{ scaleY: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeOut",
                                            delay: 0.05,
                                        }}
                                    />

                                    <span className="[writing-mode:vertical-rl] text-orientation-mixed text-sm whitespace-nowrap">
                                        {duration.end ? formatDate(duration.end, "Mon YYYY").toUpperCase() : "ONGOING"}
                                    </span>

                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
