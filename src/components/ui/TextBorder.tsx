"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getRandomIcons } from "@/components/ui/RandomIcons";

interface TextBorderAnimationProps {
    text: string;
    children?: React.ReactNode;
    className?: string;
    speed?: number;
    fontSize?: number;
}

export default function TextBorderAnimation({
    text,
    children,
    className = "",
    speed = 50,
    fontSize = 12,
}: TextBorderAnimationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isMd, setIsMd] = useState(false);

    // 1. Sync JS math with CSS rendering
    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMd(e.matches);
        handleChange(mediaQuery);
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const effectiveFontSize = isMd ? fontSize + 20 : fontSize;

    // 2. Measure container
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions(prev => (prev.width === width && prev.height === height) ? prev : { width, height });
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    // 3. Calculate Animation & Generate Random Sequence
    const { totalPerimeter, keyframes, duration, items } = useMemo(() => {
        const { width, height } = dimensions;
        if (width === 0 || height === 0) return { totalPerimeter: 0, keyframes: "", duration: 0, items: [] };

        const perimeter = (width + height) * 2;

        const pWidth = (width / perimeter) * 100;
        const pHeight = (height / perimeter) * 100;

        const t1 = pWidth;
        const t2 = pWidth + pHeight;
        const t3 = pWidth * 2 + pHeight;
        const turn = 0.2;

        const animName = `border-travel-${Math.floor(width)}-${Math.floor(height)}`;

        const cssKeyframes = `
            @keyframes ${animName} {
                0% { top: 0; left: 0; transform: rotate(0deg); }
                ${t1 - turn}% { top: 0; left: calc(100% - 1em); transform: rotate(0deg); }
                ${t1}% { top: 0; left: calc(100% - 1em); transform: rotate(90deg); }
                
                ${t2 - turn}% { top: calc(100% - 1em); left: calc(100% - 1em); transform: rotate(90deg); }
                ${t2}% { top: calc(100% - 1em); left: calc(100% - 1em); transform: rotate(180deg); }
                
                ${t3 - turn}% { top: calc(100% - 1em); left: 0; transform: rotate(180deg); }
                ${t3}% { top: calc(100% - 1em); left: 0; transform: rotate(270deg); }
                
                ${100 - turn}% { top: 0; left: 0; transform: rotate(270deg); }
                100% { top: 0; left: 0; transform: rotate(360deg); }
            }
        `;

        const totalDuration = perimeter / speed;

        // --- GENERATE RANDOMIZED CONTENT ---

        // A. Define the pattern length (Text + Space + Icon + Space)
        // We need to know roughly how long one "unit" is to calculate repeats
        const patternLengthChars = text.length + 3; // text chars + space + icon + space

        // B. Calculate how many units we need to fill the border
        const estimatedCharWidthPx = effectiveFontSize * 0.6;
        const itemsNeeded = Math.ceil(perimeter / estimatedCharWidthPx);
        const repeats = Math.ceil(itemsNeeded / patternLengthChars);

        // C. Build the sequence, picking a NEW random icon for every repeat
        const generatedItems: React.ReactNode[] = [];
        const textChars = text.split("");

        for (let i = 0; i < repeats; i++) {
            // Pick a fresh random icon for this specific segment
            const RandomIcon = getRandomIcons(1)[0];

            generatedItems.push(
                ...textChars,
                "\u00A0", // Non-breaking space
                <RandomIcon key={`icon-${i}`} />,
                "\u00A0"  // Non-breaking space
            );
        }

        return {
            totalPerimeter: perimeter,
            keyframes: cssKeyframes,
            duration: totalDuration,
            items: generatedItems
        };
    }, [dimensions, text, speed, effectiveFontSize]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden ${className}`}
            style={{ "--bfs": `${effectiveFontSize}px` } as React.CSSProperties}
        >
            {totalPerimeter > 0 && <style>{keyframes}</style>}

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                {children}
            </div>

            {totalPerimeter > 0 && (
                <div className="absolute inset-0 pointer-events-none select-none z-20">
                    {items.map((item, i) => {
                        const delay = (duration / items.length) * i * -1;
                        const animName = `border-travel-${Math.floor(dimensions.width)}-${Math.floor(dimensions.height)}`;

                        return (
                            <span
                                key={i}
                                className="absolute font-mono font-bold uppercase text-foreground/80 flex items-center justify-center"
                                style={{
                                    fontSize: "var(--bfs)",
                                    width: "1em",
                                    height: "1em",
                                    textAlign: "center",
                                    lineHeight: "1em",
                                    transformOrigin: "center center",
                                    animationName: animName,
                                    animationDuration: `${duration}s`,
                                    animationTimingFunction: "linear",
                                    animationIterationCount: "infinite",
                                    animationDelay: `${delay}s`,
                                }}
                            >
                                {item}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
}