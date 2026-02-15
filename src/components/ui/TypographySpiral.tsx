"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontInfo } from "@/types/project";
import Link from "next/link";

interface TypographySpiralProps {
    font: FontInfo;
}

export default function TypographySpiral({ font }: TypographySpiralProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    const { spiralPath, gap, isMobile } = useMemo(() => {
        const { width: w, height: h } = dimensions;
        if (w === 0 || h === 0) return { spiralPath: "", gap: 0, isMobile: false };

        const mobileCheck = w < 768;
        const isTablet = w >= 768 && w < 1024;

        const calculatedGap = mobileCheck
            ? Math.max(28, Math.min(45, w * 0.08))
            : isTablet
                ? Math.max(40, Math.min(60, Math.min(w, h) * 0.08))
                : Math.max(50, Math.min(80, Math.min(w, h) * 0.1));

        // OPTIMIZATION 2: Stop drawing laps that are hidden by the fade mask anyway.
        // Dropped from 8 to 5 on mobile, 6 to 4 on tablet, 4 to 3 on desktop.
        const laps = mobileCheck ? 5 : isTablet ? 4 : 3;
        const r = calculatedGap * 0.4;

        let d = "";

        for (let i = 0; i < laps; i++) {
            let cx1 = calculatedGap / 2 + i * calculatedGap;
            let cy1 = calculatedGap / 2 + i * calculatedGap;
            let cx2 = w - calculatedGap / 2 - i * calculatedGap;
            let cy2 = h - calculatedGap / 2 - i * calculatedGap;

            if (cx1 + r >= cx2 || cy1 + r >= cy2) break;

            if (i === 0) d += `M ${cx1 + r} ${cy1} `;

            d += `L ${cx2 - r} ${cy1} `;
            d += `Q ${cx2} ${cy1}, ${cx2} ${cy1 + r} `;

            d += `L ${cx2} ${cy2 - r} `;
            d += `Q ${cx2} ${cy2}, ${cx2 - r} ${cy2} `;

            d += `L ${cx1 + r} ${cy2} `;
            d += `Q ${cx1} ${cy2}, ${cx1} ${cy2 - r} `;

            let ny1 = cy1 + calculatedGap;

            if (i === laps - 1 || cx1 + calculatedGap + r >= cx2 - calculatedGap || ny1 + r >= cy2 - calculatedGap) {
                d += `L ${cx1} ${cy1 + r} `;
                d += `Q ${cx1} ${cy1}, ${cx1 + r} ${cy1} `;
                break;
            } else {
                d += `L ${cx1} ${ny1 + r} `;
                d += `Q ${cx1} ${ny1}, ${cx1 + r} ${ny1} `;
            }
        }

        return { spiralPath: d, gap: calculatedGap, isMobile: mobileCheck };
    }, [dimensions]);

    // OPTIMIZATION 3: Because we have fewer laps, we need WAY less text. 
    // This removes hundreds of characters from the DOM on mobile.
    const repeats = isMobile ? 6 : 12;
    const letters = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz   ".repeat(repeats);
    const safeId = font.name.replace(/\s+/g, '-');

    return (
        <div ref={containerRef} className="relative w-full h-full bg-background">
            {dimensions.width > 0 && (
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    // OPTIMIZATION 1: Hardware-accelerated CSS Mask instead of SVG Mask.
                    // This forces the GPU to render the fade out, instantly speeding up scroll performance.
                    style={{
                        WebkitMaskImage: "radial-gradient(circle at center, transparent 35%, black 75%)",
                        maskImage: "radial-gradient(circle at center, transparent 35%, black 75%)"
                    }}
                >
                    <defs>
                        <path id={`spiral-${safeId}`} d={spiralPath} fill="transparent" />
                    </defs>

                    <text
                        fontSize={Math.max(14, gap * 0.45)}
                        fontWeight="bold"
                        fill="currentColor"
                        className="text-foreground/40 tracking-widest"
                        style={{ fontFamily: font.fontFamily }}
                        textRendering="optimizeSpeed"
                    >
                        <textPath href={`#spiral-${safeId}`}>
                            <animate
                                attributeName="startOffset"
                                from="0%"
                                to="-100%"
                                // Slower duration to match the reduced text length
                                dur="140s"
                                repeatCount="indefinite"
                            />
                            {letters}
                        </textPath>
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
