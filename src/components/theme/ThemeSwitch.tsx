// src/components/theme/ThemeSwitch.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { GiFireflake, GiMoon } from "react-icons/gi";

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted && theme === "dark";

    return (
        <motion.button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
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
                <motion.div
                    key={isDark ? "dark" : "light"}
                    initial={{ opacity: 0, scale: 0.75, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.75, rotate: 15 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center justify-center"
                >
                    {isDark ? (
                        <GiFireflake className="text-4xl md:text-5xl" />
                    ) : (
                        <GiMoon className="text-[28px] md:text-[40px]" />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
}
