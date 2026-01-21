// src/components/ui/SectionHeader.tsx
"use client";

import { headingFont } from "@/lib/fonts";
import { FaPersonWalking } from "react-icons/fa6";
import Marquee from "@/components/ui/Marquee";
import RotatingButton, {
    RotatingButtonProps,
} from "@/components/ui/RotatingButton";

export interface SectionHeaderProps {
    title: string;
    delimiter?: string;
    buttonProps?: RotatingButtonProps;
    buttonPosition?: number; // Between 0 and 1
}

export default function SectionHeader({
    title,
    delimiter = "⚕♨✦❍",
    buttonProps: actionButton,
}: SectionHeaderProps) {
    // Format the content with proper spacing
    const iconContent = (
        <div className="flex items-center">
            {Array(8)
                .fill(0)
                .map((_, index) => (
                    <FaPersonWalking key={index} className="mx-10 text-4xl" />
                ))}
        </div>
    );

    const textContent = (
        <span className={`flex gap-8 whitespace-nowrap px-4`}>
            <span>{title}</span>
            <span>{delimiter}</span>
        </span>
    );

    return (
        <div className={`relative mt-20 ${actionButton ? "mb-10" : "mb-40"}`}>
            {/* Container for the marquee and button */}
            <div
                className={`relative text-6xl md:text-8xl lg:text-10xl flex items-center justify-center content-center`}
            >
                <div className={`absolute inset-0 ${headingFont}`}>
                    {/* Top marquee with walking icons */}
                    <Marquee direction="right" className="opacity-20">
                        {iconContent}
                    </Marquee>

                    {/* Main title marquee */}
                    <Marquee
                        direction="left"
                        className="-mt-[0.2em] opacity-100"
                    >
                        {textContent}
                    </Marquee>

                    {/* Bottom marquee (opposite direction) */}
                    <Marquee
                        direction="right"
                        className="-mt-[0.7em] opacity-20"
                    >
                        {textContent}
                    </Marquee>
                </div>

                {actionButton && (
                    <RotatingButton
                        {...actionButton}
                        className={`z-10 font-medium ${actionButton.className || ''}`}
                        variant="glow"
                    />
                )}
            </div>
        </div>
    );
}
