// src/components/sections/project/sections/NameSection.tsx
"use client";

import { motion } from "framer-motion";
import { displayFont } from "@/lib/fonts";
import { useState, useEffect } from "react";

interface NameSectionProps {
    name: string;
    className?: string;
}

export default function NameSection({ name, className }: NameSectionProps) {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
        };

        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => {
            window.removeEventListener("resize", checkOrientation);
        };
    }, []);

    return (
        <motion.div
            className={`flex items-center justify-center px-6 md:px-8 whitespace-nowrap snap-start 
                bg-center bg-cover bg-(image:--font-background) bg-clip-text text-transparent
                [writing-mode:${isPortrait ? "vertical-rl" : "horizontal-tb"}]
                ${displayFont} ${className}`}
            id="project-name"
            style={{
                fontStyle: "italic",
                fontSize: isPortrait
                    ? "clamp(5rem, 60vh, 20rem)"
                    : "clamp(15rem, 100vh, 55rem)",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            {name.toUpperCase()}
        </motion.div>
    );
}
