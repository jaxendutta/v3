"use client";

import React, { useId } from "react";
import Link from "next/link";

interface WavyButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    waveHeight?: number;
    waveWidth?: number;
    strokeWidth?: number;
}

export default function WavyButton({
    href,
    children,
    className = "",
    waveHeight = 14,
    waveWidth = 32,
    strokeWidth = 1.5,
}: WavyButtonProps) {
    const rawId = useId();
    const cleanId = rawId.replace(/:/g, "");
    const topStrokePatternId = `wavy-top-stroke-${cleanId}`;
    const bottomStrokePatternId = `wavy-bottom-stroke-${cleanId}`;
    const topFillPatternId = `wavy-top-fill-${cleanId}`;
    const bottomFillPatternId = `wavy-bottom-fill-${cleanId}`;

    const halfWidth = waveWidth / 2;
    const quarterWidth = waveWidth / 4;
    const midY = waveHeight / 2;
    const topY = strokeWidth;
    const bottomY = waveHeight - strokeWidth;

    // Base wave curve definition: (0, midY) -> (halfWidth, midY) -> (waveWidth, midY)
    const waveCurvePath = `M 0 ${midY} Q ${quarterWidth} ${topY}, ${halfWidth} ${midY} T ${waveWidth} ${midY}`;

    // Top filled shape: fills from the wave curve DOWNWARDS to the bottom of the top cap
    const topFillPath = `${waveCurvePath} L ${waveWidth} ${waveHeight + 2} L 0 ${waveHeight + 2} Z`;

    // Bottom filled shape: fills from -2 UPWARDS down to the wave curve
    const bottomFillPath = `M 0 -2 L ${waveWidth} -2 L ${waveWidth} ${midY} Q ${quarterWidth * 3} ${bottomY}, ${halfWidth} ${midY} T 0 ${midY} Z`;

    return (
        <Link
            href={href}
            style={{ textDecoration: "none" }}
            className={`group relative block w-full no-underline! select-none text-foreground transition-colors duration-300 ${className}`}
        >
            {/* 1. Base Stroke Layer (Visible always, transparent background) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" aria-hidden="true">
                {/* Top wavy line stroke */}
                <div className="w-full overflow-hidden block" style={{ height: waveHeight }}>
                    <svg className="w-full block" height={waveHeight} fill="none">
                        <defs>
                            <pattern
                                id={topStrokePatternId}
                                x="0"
                                y="0"
                                width={waveWidth}
                                height={waveHeight}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={waveCurvePath}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#${topStrokePatternId})`} />
                    </svg>
                </div>

                {/* Bottom wavy line stroke */}
                <div className="w-full overflow-hidden block" style={{ height: waveHeight }}>
                    <svg className="w-full block" height={waveHeight} fill="none">
                        <defs>
                            <pattern
                                id={bottomStrokePatternId}
                                x="0"
                                y="0"
                                width={waveWidth}
                                height={waveHeight}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={waveCurvePath}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#${bottomStrokePatternId})`} />
                    </svg>
                </div>
            </div>

            {/* 2. Hover Filled Background Layer (Fades in on hover) */}
            <div
                className="absolute inset-0 pointer-events-none flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-foreground"
                aria-hidden="true"
            >
                {/* Top wave filled cap */}
                <div className="w-full overflow-hidden block -mb-px" style={{ height: waveHeight }}>
                    <svg className="w-full block" height={waveHeight} fill="none">
                        <defs>
                            <pattern
                                id={topFillPatternId}
                                x="0"
                                y="0"
                                width={waveWidth}
                                height={waveHeight}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={topFillPath}
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#${topFillPatternId})`} />
                    </svg>
                </div>

                {/* Middle filled body */}
                <div className="w-full flex-1 bg-current" />

                {/* Bottom wave filled cap */}
                <div className="w-full overflow-hidden block -mt-px" style={{ height: waveHeight }}>
                    <svg className="w-full block" height={waveHeight} fill="none">
                        <defs>
                            <pattern
                                id={bottomFillPatternId}
                                x="0"
                                y="0"
                                width={waveWidth}
                                height={waveHeight}
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d={bottomFillPath}
                                    fill="currentColor"
                                    stroke="currentColor"
                                    strokeWidth={strokeWidth}
                                    strokeLinecap="round"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#${bottomFillPatternId})`} />
                    </svg>
                </div>
            </div>

            {/* 3. Interactive Content Layer */}
            <div
                style={{ textDecoration: "none" }}
                className="relative z-10 flex flex-col w-full text-foreground group-hover:text-background transition-colors duration-300 no-underline!"
            >
                <div style={{ height: waveHeight }} />
                <div
                    style={{ textDecoration: "none" }}
                    className="flex items-center justify-center py-3 text-center uppercase tracking-widest text-[13px] md:text-base font-medium no-underline!"
                >
                    {children}
                </div>
                <div style={{ height: waveHeight }} />
            </div>
        </Link>
    );
}
