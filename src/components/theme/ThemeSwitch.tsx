// src/components/ui/ThemeSwitch.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GiMoon, GiSun } from "react-icons/gi";

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            type="button"
            onClick={() => toggleTheme()}
            aria-label={`Switch to ${theme} mode`}
            className={`text-3xl md:text-5xl mix-blend-difference text-theme`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
            }}
            whileHover={{
                rotate: 0,
                transition: {
                    duration: 0.5,
                    ease: "easeInOut",
                },
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <GiSun />
                ) : (
                    <GiMoon />
                )}
            </AnimatePresence>
        </motion.button>
    );
}
