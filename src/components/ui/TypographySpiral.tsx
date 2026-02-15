"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FontInfo } from "@/types/project";
import Link from "next/link";

interface TypographySpiralProps {
    font: FontInfo;
}

export default function TypographySpiral({ font }: TypographySpiralProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Track full screen dimensions
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new ResizeObserver((entries) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            setDimensions((prev) =>
                prev.width === width && prev.height === height ? prev : { width, height }
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    // Dynamically calculate the perfect spiral WITH ROUNDED CORNERS
    const { spiralPath, gap } = useMemo(() => {
        const { width: w, height: h } = dimensions;
        if (w === 0 || h === 0) return { spiralPath: "", gap: 0 };

        const isMobile = w < 768;
        const isTablet = w >= 768 && w < 1024;

        // Tighter gap for smaller screens
        const calculatedGap = isMobile
            ? Math.max(28, Math.min(45, w * 0.08))
            : isTablet
                ? Math.max(40, Math.min(60, Math.min(w, h) * 0.08))
                : Math.max(50, Math.min(80, Math.min(w, h) * 0.1));

        const laps = isMobile ? 8 : isTablet ? 6 : 4;
        
        // This acts as the border-radius for our corners to make the text rotate smoothly
        const r = calculatedGap * 0.4; 

        let d = "";

        for (let i = 0; i < laps; i++) {
            let cx1 = calculatedGap / 2 + i * calculatedGap;
            let cy1 = calculatedGap / 2 + i * calculatedGap;
            let cx2 = w - calculatedGap / 2 - i * calculatedGap;
            let cy2 = h - calculatedGap / 2 - i * calculatedGap;

            // Stop if we run out of space in the center
            if (cx1 + r >= cx2 || cy1 + r >= cy2) break; 

            if (i === 0) {
                d += `M ${cx1 + r} ${cy1} `; // Start top-left
            }

            // Top Edge
            d += `L ${cx2 - r} ${cy1} `;
            // Top-Right Curve
            d += `Q ${cx2} ${cy1}, ${cx2} ${cy1 + r} `;

            // Right Edge
            d += `L ${cx2} ${cy2 - r} `;
            // Bottom-Right Curve
            d += `Q ${cx2} ${cy2}, ${cx2 - r} ${cy2} `;

            // Bottom Edge
            d += `L ${cx1 + r} ${cy2} `;
            // Bottom-Left Curve
            d += `Q ${cx1} ${cy2}, ${cx1} ${cy2 - r} `;

            // Move up the left edge and prepare to step inward for the next lap
            let ny1 = cy1 + calculatedGap; // The Y-level of the next inner lap
            
            // If it's the last lap, just close it up nicely. Otherwise, step inwards.
            if (i === laps - 1 || cx1 + calculatedGap + r >= cx2 - calculatedGap || ny1 + r >= cy2 - calculatedGap) {
                d += `L ${cx1} ${cy1 + r} `;
                d += `Q ${cx1} ${cy1}, ${cx1 + r} ${cy1} `;
                break;
            } else {
                // Move up left edge, stop early to curve inward
                d += `L ${cx1} ${ny1 + r} `;
                // Inward Curve (turning right to start the next lap)
                d += `Q ${cx1} ${ny1}, ${cx1 + r} ${ny1} `;
            }
        }

        return { spiralPath: d, gap: calculatedGap };
    }, [dimensions]);

    // Extra long string so it never runs out during the infinite crawl
    const letters = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz   ".repeat(30);
    const safeId = font.name.replace(/\s+/g, '-');

    return (
        <div ref={containerRef} className="relative w-full h-full bg-background">
            {/* SVG Background Layer */}
            {dimensions.width > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <path id={`spiral-${safeId}`} d={spiralPath} fill="transparent" />

                        <radialGradient id={`fadeMask-${safeId}`} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="45%" stopColor="transparent" />
                            <stop offset="75%" stopColor="white" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="white" stopOpacity="1" />
                        </radialGradient>

                        <mask id={`spiralMask-${safeId}`}>
                            <rect x="0" y="0" width="100%" height="100%" fill={`url(#fadeMask-${safeId})`} />
                        </mask>
                    </defs>

                    <text
                        fontSize={Math.max(14, gap * 0.45)}
                        fontWeight="bold"
                        fill="currentColor"
                        className="text-foreground/40 tracking-widest"
                        mask={`url(#spiralMask-${safeId})`}
                        style={{ fontFamily: font.fontFamily }}
                    >
                        <motion.textPath
                            href={`#spiral-${safeId}`}
                            initial={{ startOffset: "0%" }}
                            animate={{ startOffset: "-100%" }}
                            transition={{ ease: "linear", duration: 120, repeat: Infinity }}
                        >
                            {letters}
                        </motion.textPath>
                    </text>
                </svg>
            )}

            {/* Central Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="pointer-events-auto flex flex-col items-center text-center gap-4 md:gap-6 max-w-2xl">
                    <div style={{ fontFamily: font.fontFamily }}>
                        <Link href={font.url} className="text-4xl md:text-6xl no-underline!">
                            {font.name}
                        </Link>
                    </div>
                    <p className="text-xs md:text-base text-muted-foreground leading-relaxed max-w-xs md:max-w-lg">
                        {font.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
