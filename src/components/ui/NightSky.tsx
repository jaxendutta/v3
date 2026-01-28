// src/components/ui/NightSky.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

function Noise() {
    const { theme } = useTheme();

    const isClient = typeof window !== "undefined";
    const isFirefox =
        isClient && navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

    // Get filter value based on theme and browser
    const getFilterValue = () => {
        if (theme === "dark") {
            return isFirefox
                ? "contrast(125%) brightness(400%) invert(100%)"
                : "contrast(145%) brightness(650%) invert(100%)";
        } else {
            return isFirefox
                ? "contrast(100%) brightness(300%) invert(0%)"
                : "contrast(125%) brightness(400%) invert(0%)";
        }
    };

    return (
        <motion.div
            className={`max-w-[1000px] h-full`}
            style={{
                backgroundImage: `radial-gradient(circle at 0% 0%, 
                                ${theme === "dark" ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)" : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"}),
                                url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                filter: getFilterValue(),
                mixBlendMode: theme === "dark" ? "color-dodge" : "multiply",
            }}
        />
    );
}

function Moon() {
    return (
        <motion.div
            className="absolute top-0 -translate-y-1/5 -translate-x-1/5 size-[200px] md:size-[250px] rounded-full bg-theme"
            animate={{ 
                x: [-15, 0, -15],
                y: [-15, 0, -15] }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

interface NightSkyProps {
    className?: string;
}

export default function NightSky({ className = "" }: NightSkyProps) {
    return (
        <div className={`w-full h-[100vh] overflow-visible ${className}`}>
            <Noise />
            <Moon />
        </div>
    );
}
