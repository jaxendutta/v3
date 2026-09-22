"use client";

import React from "react";
import Image from "next/image";

export type IPhoneColor = "cosmic-orange" | "natural-titanium" | "black-titanium" | "silver";

interface IPhoneMockupProps {
    src: string;
    alt: string;
    color?: IPhoneColor;
    className?: string;
    priority?: boolean;
}

const COLOR_STYLES: Record<IPhoneColor, { outerChassis: string; ring: string; button: string }> = {
    "cosmic-orange": {
        outerChassis: "bg-gradient-to-b from-[#ff824c] via-[#eb622b] to-[#b34015]",
        ring: "ring-1 ring-[#ff9f73]/50",
        button: "bg-[#cf5121]",
    },
    "natural-titanium": {
        outerChassis: "bg-gradient-to-b from-[#a8a49c] via-[#8c8880] to-[#69655f]",
        ring: "ring-1 ring-[#c2bfb8]/40",
        button: "bg-[#7d7971]",
    },
    "black-titanium": {
        outerChassis: "bg-gradient-to-b from-[#383a3f] via-[#242629] to-[#17181a]",
        ring: "ring-1 ring-[#50535a]/40",
        button: "bg-[#2b2d30]",
    },
    silver: {
        outerChassis: "bg-gradient-to-b from-[#f0f2f5] via-[#d4d8de] to-[#a8adb5]",
        ring: "ring-1 ring-white/60",
        button: "bg-[#b8bcc4]",
    },
};

export default function IPhoneMockup({
    src,
    alt,
    color = "cosmic-orange",
    className = "",
    priority = false,
}: IPhoneMockupProps) {
    const theme = COLOR_STYLES[color] ?? COLOR_STYLES["cosmic-orange"];

    return (
        <div
            className={`relative mx-auto aspect-9/19.5 w-full max-w-70 select-none ${className}`}
        >
            {/* Left Buttons: Action Button & Volume */}
            <div
                className={`absolute -left-0.75 top-[14%] h-6 w-0.75 rounded-l-xs ${theme.button}`}
                aria-hidden
            />
            <div
                className={`absolute -left-0.75 top-[22%] h-11.5 w-0.75 rounded-l-xs ${theme.button}`}
                aria-hidden
            />
            <div
                className={`absolute -left-0.75 top-[32%] h-11.5 w-0.75 rounded-l-xs ${theme.button}`}
                aria-hidden
            />

            {/* Right Buttons: Power & Camera Control */}
            <div
                className={`absolute -right-0.75 top-[24%] h-17 w-0.75 rounded-r-xs ${theme.button}`}
                aria-hidden
            />
            <div
                className={`absolute -right-0.75 top-[40%] h-9.5 w-0.75 rounded-r-xs opacity-90 ${theme.button}`}
                aria-hidden
            />

            {/* Outer Titanium Chassis */}
            <div
                className={`relative h-full w-full rounded-[48px] p-0.75 shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${theme.outerChassis} ${theme.ring}`}
            >
                {/* Inner Antenna Line / Chassis Bevel Accent */}
                <div className="relative h-full w-full rounded-[45px] bg-black p-1.25">
                    {/* Screen Container */}
                    <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-black">
                        {/* Dynamic Island */}
                        <div
                            className="absolute left-1/2 top-2.5 z-30 flex h-6.5 w-23 -translate-x-1/2 items-center justify-between rounded-full bg-black px-2 shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                            aria-hidden
                        >
                            {/* Front Camera Lens */}
                            <div className="h-3 w-3 rounded-full bg-[#0a0f18] ring-1 ring-white/15 flex items-center justify-center">
                                <div className="h-1 w-1 rounded-full bg-[#1b3b6f]/70" />
                            </div>
                            {/* FaceID / Proximity Sensor */}
                            <div className="h-2.5 w-2.5 rounded-full bg-[#05070a] ring-1 ring-white/5" />
                        </div>

                        {/* Speaker Ear-piece Micro-slit */}
                        <div
                            className="absolute left-1/2 top-1 z-30 h-0.75 w-11.5 -translate-x-1/2 rounded-full bg-[#151515]"
                            aria-hidden
                        />

                        {/* Screenshot Image */}
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 280px, 320px"
                            priority={priority}
                            unoptimized={src.endsWith(".gif")}
                            draggable={false}
                        />

                        {/* Realistic Glass Screen Sheen Overlay */}
                        <div
                            className="pointer-events-none absolute inset-0 z-20 bg-linear-to-tr from-transparent via-white/3 to-white/8"
                            aria-hidden
                        />

                        {/* Home Indicator Bar */}
                        <div
                            className="absolute bottom-2 left-1/2 z-30 h-1 w-25 -translate-x-1/2 rounded-full bg-white/40 shadow-xs"
                            aria-hidden
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
