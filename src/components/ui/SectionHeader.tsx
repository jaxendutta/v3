// src/components/ui/SectionHeader.tsx
"use client";

import { waterResistantFont } from "@/lib/fonts";
import RotatingButton, {
    RotatingButtonProps,
} from "@/components/ui/RotatingButton";
import WavyDivider from "@/components/ui/WavyDivider";

export interface SectionHeaderProps {
    title: string;
    delimiter?: string;
    buttonProps?: RotatingButtonProps;
    buttonPosition?: number;
    className?: string;
}

export default function SectionHeader({
    title,
    buttonProps: actionButton,
    className = "",
}: SectionHeaderProps) {
    return (
        <header className={`relative w-full text-center mt-12 sm:mt-16 md:mt-24 select-none ${className}`}>
            <h2
                className={`${waterResistantFont} text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-foreground transition-colors hover:text-accent inline-block cursor-default leading-none`}
            >
                {title}
            </h2>

            {actionButton && (
                <div className="mt-6 flex justify-center">
                    <RotatingButton
                        {...actionButton}
                        className={`font-medium ${actionButton.className || ""}`}
                        variant="glow"
                    />
                </div>
            )}

            <div className="mx-[5vw] mt-4 sm:mt-6 md:mt-8">
                <WavyDivider className="w-full text-current opacity-60" />
            </div>
        </header>
    );
}
