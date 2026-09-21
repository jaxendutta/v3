"use client";

import React, { useId } from "react";

interface WavyDividerProps {
    className?: string;
    height?: number;
    waveWidth?: number;
    strokeWidth?: number;
}

export default function WavyDivider({
    className = "w-full text-current opacity-60",
    height = 14,
    waveWidth = 32,
    strokeWidth = 1.5,
}: WavyDividerProps) {
    const rawId = useId();
    // Sanitize id for SVG url references (useId may contain colons)
    const patternId = `wavy-pattern-${rawId.replace(/:/g, "")}`;
    const halfWidth = waveWidth / 2;
    const quarterWidth = waveWidth / 4;
    const midY = height / 2;
    const topY = strokeWidth;
    const bottomY = height - strokeWidth;

    // Smooth sine wave approximation:
    // From (0, midY) curve up to (quarterWidth, topY) to (halfWidth, midY),
    // then reflect down to bottomY and end at (waveWidth, midY).
    const pathD = `M 0 ${midY} Q ${quarterWidth} ${topY}, ${halfWidth} ${midY} T ${waveWidth} ${midY}`;

    return (
        <div className={`overflow-hidden select-none pointer-events-none ${className}`} aria-hidden="true">
            <svg
                className="w-full block"
                height={height}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id={patternId}
                        x="0"
                        y="0"
                        width={waveWidth}
                        height={height}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={pathD}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
            </svg>
        </div>
    );
}
