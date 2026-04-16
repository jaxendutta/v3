// src/components/sections/hero/HeroArt.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState } from "react";

function generateNoiseDataURL(size = 256): string {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const v = Math.floor(
            (Math.random() * 0.5 + Math.random() * 0.3 + Math.random() * 0.2) * 255
        );
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
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
        setNoiseUrl(generateNoiseDataURL(256));
    }, []);

    if (!noiseUrl) return <div className="w-full h-[100vh]" />;

    // ── iOS: no mix-blend-mode, colours punched up to match desktop visually ──
    if (isIOS) {
        // Light mode on desktop: blue/indigo noise at opacity 0.30 with
        // multiply blend on cream (#fff7ed) + brightness(400%) filter.
        // That produces the distinct blue-purple cloudy squares you see.
        // We replicate it with high-opacity direct colour blobs.
        const lightGradient = `
            radial-gradient(ellipse 55% 45% at 18% 18%, rgba(140, 160, 230, 0.75) 0%, transparent 65%),
            radial-gradient(ellipse 45% 40% at 72% 8%,  rgba(160, 140, 240, 0.65) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 62% 62%, rgba(130, 155, 225, 0.60) 0%, transparent 65%),
            radial-gradient(ellipse 40% 45% at 8%  65%, rgba(150, 145, 235, 0.55) 0%, transparent 60%)
        `;
        const darkGradient = `
            radial-gradient(ellipse 55% 45% at 18% 18%, rgba(80, 95, 185, 0.60) 0%, transparent 65%),
            radial-gradient(ellipse 45% 40% at 72% 8%,  rgba(100, 80, 200, 0.50) 0%, transparent 60%),
            radial-gradient(ellipse 50% 45% at 62% 62%, rgba(65, 90, 170, 0.45) 0%, transparent 65%),
            radial-gradient(ellipse 40% 45% at 8%  65%, rgba(110, 90, 195, 0.40) 0%, transparent 60%)
        `;

        return (
            <div className="w-full h-[100vh] overflow-visible relative">
                {/* Colour blobs */}
                <div
                    className="absolute inset-0 z-[1] w-full h-full pointer-events-none"
                    style={{
                        background: theme === "dark" ? darkGradient : lightGradient,
                    }}
                />
                {/* Noise grain on top — low opacity so it textures without dominating */}
                <motion.div
                    className="absolute inset-0 z-[2] w-full h-full pointer-events-none bg-[size:20vh_20vh]"
                    style={{
                        backgroundImage: `url("${noiseUrl}")`,
                        opacity: theme === "dark" ? 0.08 : 0.12,
                        mixBlendMode: "overlay",
                    }}
                    animate={{ backgroundPosition: ["0px 0px", "100vh 0px"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>
        );
    }

    // ── Desktop: original implementation exactly ───────────────────────────────
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
        <div className="w-full h-[100vh] overflow-visible relative">
            <motion.div
                className="absolute inset-0 z-[1] w-full h-full pointer-events-none bg-[size:20vh_20vh] opacity-30"
                animate={{ backgroundPosition: ["0px 0px", "100vh 0px"] }}
                transition={{
                    backgroundPosition: { duration: 20, repeat: Infinity, ease: "linear" },
                }}
                style={{
                    backgroundImage: `radial-gradient(circle at 0% 0%, ${
                        theme === "dark"
                            ? "rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)"
                            : "rgb(0, 20, 90), rgba(255, 255, 0, 0)"
                    }), url("${noiseUrl}")`,
                    filter: getFilterValue(),
                    mixBlendMode: theme === "dark" ? "color-dodge" : "multiply",
                }}
            />
        </div>
    );
}
