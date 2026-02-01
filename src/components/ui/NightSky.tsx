// src/components/ui/NightSky.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

function Noise() {
    const { theme } = useTheme();
    const [isFirefox, setIsFirefox] = useState(false);

    useEffect(() => {
        setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
    }, []);

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
            className="absolute inset-0 z-[1] w-full h-full pointer-events-none bg-[size:20vh_20vh] opacity-30"
            animate={{
                backgroundPosition: ["0px 0px", "100vh 0px"]
            }}
            transition={{
                backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            style={{
                backgroundImage: `radial-gradient(circle at 0% 0%, 
                                ${theme === "dark" ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)" : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"}),
                                url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                filter: getFilterValue(),
                mixBlendMode: theme === "dark" ? "color-dodge" : "multiply",
            }}
        />
    );
}

interface NightSkyProps {
    className?: string;
}

export default function NightSky({ className = "" }: NightSkyProps) {
    return (
        <div className={`w-full h-[100vh] overflow-visible relative ${className}`}>
            <Noise />
        </div>
    );
}
