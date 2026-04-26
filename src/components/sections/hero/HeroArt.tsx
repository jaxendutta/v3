// src/components/sections/hero/HeroArt.tsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useState, useRef } from "react";
import { getRandomIcons } from "@/components/ui/RandomIcons";

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

// 1. The Autonomous "Glitch" Icon
function GlitchIcon() {
    const [IconComponent, setIconComponent] = useState(() => getRandomIcons(1)[0]);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const triggerGlitch = () => {
            if (!isMounted.current) return;

            let count = 0;
            // Randomly determine how many times this specific glitch will flash (3 to 8 times)
            const maxShuffles = Math.floor(Math.random() * 6) + 3;

            const flashInterval = setInterval(() => {
                if (isMounted.current) {
                    setIconComponent(() => getRandomIcons(1)[0]);
                }
                count++;

                if (count >= maxShuffles) {
                    clearInterval(flashInterval);
                    // Schedule the next spontaneous glitch event (between 5 and 15 seconds from now)
                    const nextGlitchDelay = Math.random() * 10000 + 5000;
                    setTimeout(triggerGlitch, nextGlitchDelay);
                }
            }, 80); // Rapid 80ms flashes
        };

        // Start the first glitch cycle at a random offset so they don't all flash at once
        const initialDelay = Math.random() * 10000;
        const initialTimeout = setTimeout(triggerGlitch, initialDelay);

        return () => {
            isMounted.current = false;
            clearTimeout(initialTimeout);
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center text-foreground/25 dark:text-foreground/15">
            <IconComponent size="75%" />
        </div>
    );
}

// 2. A Denser, Smaller Grid Block for iOS Marquee
function IconBlock({ pattern }: { pattern: boolean[] }) {
    return (
        // Box is now 60vh x 60vh (5 columns of 12vh)
        <div className="w-[60vh] h-[60vh] grid grid-cols-5 grid-rows-5 shrink-0 border-t border-l border-foreground/[0.04] box-border">
            {pattern.map((hasIcon, i) => (
                <div key={i} className="w-[12vh] h-[12vh] flex items-center justify-center border-r border-b border-foreground/[0.04] box-border relative">
                    {hasIcon && <GlitchIcon />}
                </div>
            ))}
        </div>
    );
}

// 3. The Re-imagined iOS Marquee
function IOSHeroArt({ isDark }: { isDark: boolean }) {
    const bg = isDark ? "#18181b" : "#fff7ed";
    const [pattern, setPattern] = useState<boolean[]>([]);

    useEffect(() => {
        // Generate the grid pattern once on mount. 20% chance a cell is empty.
        setPattern(Array.from({ length: 25 }).map(() => Math.random() > 0.2));
    }, []);

    if (pattern.length === 0) return null;

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-background pointer-events-none opacity-50">

            {/* The Seamless Infinite Loop */}
            <motion.div
                // Start one block (60vh) to the left to hide the seam
                className="absolute top-0 left-[-60vh] flex flex-wrap content-start h-[120vh] w-[300vh]"
                // Translate exactly one block width (60vh) to create the loop
                animate={{ x: ["0vh", "60vh"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
                {/* We render two rows of blocks to cover the vertical height of mobile screens */}
                <div className="flex w-full">
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                </div>
                <div className="flex w-full">
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                    <IconBlock pattern={pattern} />
                </div>
            </motion.div>

            {/* Bottom Fade */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[25%] pointer-events-none z-20"
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
                <IOSHeroArt isDark={isDark} />
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
