// src/components/ui/CaseGlitch.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CaseGlitchProps {
    text: string;
    className?: string;
}

export function CaseGlitch({ text, className }: CaseGlitchProps) {
    const [glitchState, setGlitchState] = useState(0);

    // Properly typed variants
    const glitchVariants = [
        {
            fontWeight: 400,
            fontStyle: "normal" as const,
            textDecoration: "none" as const,
            textTransform: "none" as const,
        },
        {
            fontWeight: 700,
            fontStyle: "italic" as const,
            textDecoration: "none" as const,
            textTransform: "uppercase" as const,
        },
        {
            fontWeight: 100,
            fontStyle: "normal" as const,
            textDecoration: "underline" as const,
            textTransform: "lowercase" as const,
        },
        {
            fontWeight: 500,
            fontStyle: "italic" as const,
            textDecoration: "line-through" as const,
            textTransform: "capitalize" as const,
        },
        {
            fontWeight: 300,
            fontStyle: "normal" as const,
            textDecoration: "none" as const,
            textTransform: "uppercase" as const,
        },
        {
            fontWeight: 600,
            fontStyle: "italic" as const,
            textDecoration: "none" as const,
            textTransform: "lowercase" as const,
        },
        {
            fontWeight: 200,
            fontStyle: "normal" as const,
            textDecoration: "underline" as const,
            textTransform: "none" as const,
        },
        {
            fontWeight: 800,
            fontStyle: "italic" as const,
            textDecoration: "none" as const,
            textTransform: "capitalize" as const,
        },
        {
            fontWeight: 100,
            fontStyle: "normal" as const,
            textDecoration: "line-through" as const,
            textTransform: "uppercase" as const,
        },
        {
            fontWeight: 500,
            fontStyle: "italic" as const,
            textDecoration: "none" as const,
            textTransform: "lowercase" as const,
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitchState((prev) => (prev + 1) % glitchVariants.length);
        }, 120); // Change every 120ms for a glitchy feel

        return () => clearInterval(interval);
    }, [glitchVariants.length]);

    return (
        <motion.div
            className={`my-20 flex items-center justify-center gap-4 text-accent ${className}`}
            animate={glitchVariants[glitchState]}
            transition={{
                duration: 0.05,
                ease: "easeInOut",
            }}
        >
            {text}
        </motion.div>
    );
}

export default CaseGlitch;
