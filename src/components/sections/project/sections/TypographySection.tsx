"use client";

import { FontInfo } from "@/types/project";
import { useEffect } from "react";
import TypographySpiral from "@/components/ui/TypographySpiral";

interface TypographySectionProps {
    id?: string;
    typography: FontInfo[];
}

export default function TypographySection({
    id,
    typography,
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

    return (
        <>
            {typography.map((font, index) => (
                <section
                    key={index}
                    id={index === 0 ? id : undefined}
                    className="relative snap-center shrink-0 w-screen h-full flex items-center justify-center overflow-hidden"
                >
                    <TypographySpiral font={font} />
                </section>
            ))}
        </>
    );
}
