// src/components/ui/SectionHeader.tsx
"use client";

import { emojiFont, headingFont } from "@/lib/fonts";
import { FaPersonWalking } from "react-icons/fa6";
import Marquee from "@/components/ui/Marquee";
import RotatingButton, {
    RotatingButtonProps,
} from "@/components/ui/RotatingButton";
import RandomIcons from "@/components/ui/RandomIcons";

export interface SectionHeaderProps {
    title: string;
    delimiter?: string;
    buttonProps?: RotatingButtonProps;
    buttonPosition?: number; // Between 0 and 1
}

export default function SectionHeader({
    title,
    delimiter,
    buttonProps: actionButton,
}: SectionHeaderProps) {
    // Format the content with proper spacing
    const iconContent = (
        <div className="flex items-center">
            {Array(8)
                .fill(0)
                .map((_, index) => (
                    <FaPersonWalking key={index} className="mx-6" />
                ))}
        </div>
    );

    const textContent = (
        <span className={`flex gap-6 md:gap-12 px-1.5 md:px-4 whitespace-nowrap items-center justify-center leading-none`}>
            <span className={`mb-2 italic`}>{title}</span>
            <span className={`text-[0.9em] ${emojiFont} flex`}>
                {delimiter ? delimiter : <RandomIcons />}   </span>
        </span>
    );

    return (
        <div className={`relative mt-14 md:mt-20 ${actionButton ? "mb-10" : "mb-20 md:mb-40"}`}>
            {/* Container for the marquee and button */}
            <div
                className={`relative flex items-center justify-center content-center`}
            >
                <div className={`absolute inset-0 ${headingFont}`}>
                    {/* Top marquee with walking icons */}
                    <Marquee direction="right" className="opacity-10 text-3xl md:text-4xl lg:text-6xl">
                        {iconContent}
                    </Marquee>

                    {/* Main title marquee */}
                    <Marquee
                        direction="left"
                        className="-mt-[0.4em] md:-mt-[0.35em] opacity-100 text-5xl md:text-8xl lg:text-10xl"
                    >
                        {textContent}
                    </Marquee>

                    {/* Background marquee */}
                    <Marquee
                        direction="right"
                        className="-mt-[0.8em] opacity-10 text-4xl md:text-6xl lg:text-8xl"
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
