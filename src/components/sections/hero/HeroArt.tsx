// src/components/sections/hero/HeroArt.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

function generateGreyNoiseDataURL(size = 256): string {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.floor(
            (Math.random() * 0.5 + Math.random() * 0.3 + Math.random() * 0.2) * 300
        );
        data[i] = v; data[i + 1] = v; data[i + 2] = v; data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
}

function detectIOS(): boolean {
    return (
        /iPhone|iPad|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
}

export default function HeroArt() {
    const { theme } = useTheme();
    const [isFirefox, setIsFirefox] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [noiseUrl, setNoiseUrl] = useState<string>("");

    useEffect(() => {
        setIsFirefox(navigator.userAgent.toLowerCase().indexOf("firefox") > -1);
        setIsIOS(detectIOS());
        setNoiseUrl(generateGreyNoiseDataURL(256));
    }, []);

    const isDark = theme === "dark";

    if (!noiseUrl) return <div className="w-[100vw] h-[100vh]" />;

    const filterValue = isDark
        ? isFirefox
            ? "contrast(125%) brightness(400%) invert(100%)"
            : "contrast(145%) brightness(650%) invert(100%)"
        : isFirefox
            ? "contrast(100%) brightness(300%) invert(0%)"
            : "contrast(125%) brightness(400%) invert(0%)";

    // iOS workaround: A linear-gradient instead of a radial-gradient
    // This keeps the top, left, and right edges perfectly sharpand only starts fading out at the bottom 25% of the screen
    const iosMaskStyle = isIOS ? {
        WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)",
        maskImage: "linear-gradient(to bottom, black 0%, black 75%, transparent 100%)"
    } : {};

    return (
        <div className="w-[100vw] h-[100vh] overflow-hidden relative">
            <motion.div
                className="absolute inset-0 z-[1] w-full h-full pointer-events-none bg-[size:20vh_20vh] opacity-20"
                animate={{ backgroundPosition: ["0px 0px", "100vh 0px"] }}
                transition={{
                    backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" },
                }}
                style={{
                    backgroundImage: `radial-gradient(circle at 0% 0%, ${isDark
                        ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)"
                        : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"
                        }), url("${noiseUrl}")`,
                    filter: filterValue,
                    mixBlendMode: isDark ? "color-dodge" : "multiply",
                    ...iosMaskStyle
                }}
            />
        </div>
    );
}
