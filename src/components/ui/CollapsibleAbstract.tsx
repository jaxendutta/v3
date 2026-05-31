// src/components/ui/CollapsibleAbstract.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { codeFont } from "@/lib/fonts";

interface CollapsibleAbstractProps {
    abstract: string;
    /** Delay for the animated underline (seconds). Default 0.05 */
    lineDelay?: number;
}

export default function CollapsibleAbstract({
    abstract,
    lineDelay = 0.05,
}: CollapsibleAbstractProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(true);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isExpanded) {
            setIsClamped(false);
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className={`${codeFont} text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground-subtle`}>
                    Abstract
                </p>
                <button
                    onClick={toggle}
                    className={`${codeFont} md:hidden text-[9px] uppercase tracking-widest border-b border-current text-muted-foreground-subtle transition-opacity`}
                >
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            </div>

            <motion.div
                className="w-full h-0.25 origin-left bg-current mb-3"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: lineDelay }}
            />

            <motion.div
                initial={false}
                animate={{ height: isExpanded ? "auto" : "4.875rem" }}
                onAnimationComplete={() => { if (!isExpanded) setIsClamped(true); }}
                className={`overflow-hidden md:!h-auto ${!isExpanded ? "md:cursor-auto cursor-pointer" : ""}`}
                onClick={!isExpanded ? toggle : undefined}
                transition={{ duration: 0.35, ease: "easeInOut" }}
            >
                <p className={`text-xs md:text-sm leading-relaxed text-muted-foreground ${
                    isClamped
                        ? "line-clamp-4 text-left md:line-clamp-none md:text-justify"
                        : "text-justify"
                }`}>
                    {abstract}
                </p>
            </motion.div>
        </div>
    );
}
