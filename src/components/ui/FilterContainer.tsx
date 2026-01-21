// src/components/ui/FilterContainer.tsx
"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface FilterContainerProps {
    children: ReactNode;
    isVisible: boolean;
    className?: string;
}

export default function FilterContainer({
    children,
    isVisible,
    className = "",
}: FilterContainerProps) {
    // Animation variants for the filter container
    const containerVariants: Variants = {
        hidden: {
            height: 0,
            opacity: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            overflow: "hidden",
        },
        visible: {
            height: "auto",
            opacity: 1,
            marginTop: "1rem",
            marginBottom: "2rem",
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            overflow: "visible",
            transition: {
                height: {
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    duration: 0.4,
                },
                opacity: {
                    duration: 0.3,
                    delay: 0.1,
                },
                overflow: {
                    delay: 0.3,
                },
            },
        },
        exit: {
            height: 0,
            opacity: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0,
            overflow: "hidden",
            transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2 },
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div
                    className={`border border-current ${className}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="px-4 md:px-6">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// FilterTag component for consistent tag styling
interface FilterTagProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

export function FilterTag({ label, isActive, onClick }: FilterTagProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`px-3 py-1 border rounded-full text-xs md:text-sm transition-colors ${
                isActive
                    ? "bg-[var(--color-text)] text-[var(--color-background)]"
                    : "border-current hover:bg-[var(--color-text)] hover:text-[var(--color-background)]"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {label}
        </motion.button>
    );
}

// FilterSection component for consistent section styling
interface FilterSectionProps {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}

export function FilterSection({ title, icon, children }: FilterSectionProps) {
    return (
        <div className="w-full">
            <h2 className="text-sm md:text-lg mb-2 md:mb-4 flex items-center gap-2 font-semibold">
                {icon} {title}
            </h2>
            <div className="flex flex-wrap gap-2">{children}</div>
        </div>
    );
}
