"use client";

import { FontInfo } from "@/types/project";
import { useEffect } from "react";
import TypographySpiral from "@/components/ui/TypographySpiral";

interface TypographySectionProps {
    id?: string;
    typography: FontInfo[];
    isLandscape: boolean;
}

export default function TypographySection({
    id,
    typography,
    isLandscape,
}: TypographySectionProps) {
    // Load fonts dynamically
    useEffect(() => {
        const loadFont = async (font: FontInfo) => {
            if (document.querySelector(`link[href="${font.url}"]`)) {
                return;
            }
            const link = document.createElement("link");
            link.href = font.url;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        };

        typography.forEach(loadFont);

        return () => {
            typography.forEach((font) => {
                const link = document.querySelector(`link[href="${font.url}"]`);
                if (link) {
                    document.head.removeChild(link);
                }
            });
        };
    }, [typography]);

    return <TypographySpiral id={id} fonts={typography} isLandscape={isLandscape} />;
}
