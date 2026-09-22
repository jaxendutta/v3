"use client";

import { useId } from "react";

interface WavyDividerProps {
    className?: string;
    orientation?: "horizontal" | "vertical";
    height?: number;
    width?: number;
    waveLength?: number;
    strokeWidth?: number;
}

export default function WavyDivider({
    className = "",
    orientation = "horizontal",
    height = 14,
    width = 14,
    waveLength = 32,
    strokeWidth = 1.5,
}: WavyDividerProps) {
    const rawId = useId();
    const cleanId = rawId.replace(/:/g, "");
    const patternId = `wavy-pattern-${orientation}-${cleanId}`;

    if (orientation === "vertical") {
        const midX = width / 2;
        const leftX = strokeWidth;
        const halfLength = waveLength / 2;
        const quarterLength = waveLength / 4;

        // Vertical sine wave from (midX, 0) to (midX, waveLength)
        const pathD = `M ${midX} 0 Q ${leftX} ${quarterLength}, ${midX} ${halfLength} T ${midX} ${waveLength}`;

        return (
            <div
                className={`overflow-hidden select-none pointer-events-none ${className || "h-full w-full text-current opacity-70"}`}
                aria-hidden="true"
            >
                <svg
                    className="h-full block w-full"
                    width={width}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern
                            id={patternId}
                            x="0"
                            y="0"
                            width={width}
                            height={waveLength}
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

    // Horizontal orientation (default)
    const midY = height / 2;
    const topY = strokeWidth;
    const halfWidth = waveLength / 2;
    const quarterWidth = waveLength / 4;

    const pathD = `M 0 ${midY} Q ${quarterWidth} ${topY}, ${halfWidth} ${midY} T ${waveLength} ${midY}`;

    return (
        <div
            className={`overflow-hidden select-none pointer-events-none ${className || "w-full text-current opacity-70"}`}
            aria-hidden="true"
        >
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
                        width={waveLength}
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
