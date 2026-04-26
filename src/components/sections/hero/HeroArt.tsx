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

// Divided into 3 columns using existing public images
const COL_1 = ["/rgap.png", "/emma.png", "/v2.png", "/hivemind.png"];
const COL_2 = ["/fabler.png", "/asher.png", "/v1.png", "/pvc.png"];
const COL_3 = ["/hivemind.png", "/lightbox.png", "/asher.png", "/rgap.png"];
const COL_4 = ["/evse-opt.png", "/minimax-tic-tac-toe.png", "/space-invaders.png", "/straights.png"];

function VerticalStackHero({ isDark }: { isDark: boolean }) {
    const bg = isDark ? "#18181b" : "#fff7ed";

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex justify-center items-center bg-background">

            {/* Tilted Marquee Container */}
            <div
                // 1. Reduced scale from 1.1 to 1.05 so the rotation doesn't throw the corners too far off-screen
                className={`absolute w-[150vw] md:w-[100vw] h-[160vh] flex justify-center gap-3 md:gap-5 rotate-[-6deg] scale-[1.05] pointer-events-none transition-all duration-500
                ${isDark ? 'opacity-80' : 'opacity-30 grayscale contrast-125'}`}
                style={{
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
                }}
            >

                {/* Column 1 - Moves UP (Left Extreme - 50% visible) */}
                <motion.div
                    // 2. Changed from 35vw to 27vw on mobile, and 16vw to 14vw on desktop
                    className="flex flex-col gap-3 md:gap-5 w-[27vw] md:w-[14vw]"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {[...COL_1, ...COL_1].map((src, i) => (
                        <div key={i} className="w-full aspect-[1/2] rounded-xl overflow-hidden border border-foreground/10 shadow-2xl shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                    ))}
                </motion.div>

                {/* Column 2 - Moves DOWN (Middle Left - 100% visible) */}
                <motion.div
                    className="flex flex-col gap-3 md:gap-5 w-[27vw] md:w-[14vw] pt-[15vh]"
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                >
                    {[...COL_2, ...COL_2].map((src, i) => (
                        <div key={i} className="w-full aspect-[1/2] rounded-xl overflow-hidden border border-foreground/10 shadow-2xl shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                    ))}
                </motion.div>

                {/* Column 3 - Moves UP (Middle Right - 100% visible) */}
                <motion.div
                    className="flex flex-col gap-3 md:gap-5 w-[27vw] md:w-[14vw] pt-[5vh]"
                    animate={{ y: ["0%", "-50%"] }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                >
                    {[...COL_3, ...COL_3].map((src, i) => (
                        <div key={i} className="w-full aspect-[1/2] rounded-xl overflow-hidden border border-foreground/10 shadow-2xl shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                    ))}
                </motion.div>

                {/* Column 4 - Moves DOWN (Right Extreme - 50% visible) */}
                <motion.div
                    className="flex flex-col gap-3 md:gap-5 w-[27vw] md:w-[14vw] pt-[20vh]"
                    animate={{ y: ["-50%", "0%"] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    {[...COL_4, ...COL_4].map((src, i) => (
                        <div key={i} className="w-full aspect-[1/2] rounded-xl overflow-hidden border border-foreground/10 shadow-2xl shrink-0">
                            <img src={src} alt="" className="w-full h-full object-cover object-top" />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* VIGNETTE / GLASSMORPHISM OVERLAY */}
            <div
                className="absolute inset-0 z-10 pointer-events-none transition-colors duration-500"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse at center, ${bg}80 15%, ${bg}c0 60%, ${bg}f5 100%)`
                        : `radial-gradient(ellipse at center, ${bg}e6 15%, ${bg}99 60%, ${bg}33 100%)`,
                    backdropFilter: "blur(1.5px)",
                    WebkitBackdropFilter: "blur(1.5px)",
                }}
            />

            {/* Bottom Fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-20 transition-colors duration-500"
                style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${bg} 100%)`,
                }}
            />
        </div>
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

    if (isIOS) {
        return (
            <div className="w-full h-[100vh] overflow-visible relative">
                <VerticalStackHero isDark={isDark} />
            </div>
        );
    }

    if (!noiseUrl) return <div className="w-full h-[100vh]" />;

    const filterValue = isDark
        ? isFirefox
            ? "contrast(125%) brightness(400%) invert(100%)"
            : "contrast(145%) brightness(650%) invert(100%)"
        : isFirefox
            ? "contrast(100%) brightness(300%) invert(0%)"
            : "contrast(125%) brightness(400%) invert(0%)";

    return (
        <div className="w-full h-[100vh] overflow-visible relative">
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
                }}
            />
        </div>
    );
}
