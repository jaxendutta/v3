// src/components/sections/project/sections/TypographySection.tsx
"use client";

import { FontInfo } from "@/types/project";
import { useEffect } from "react";
import StyledLink from "@/components/ui/StyledLink";
import { motion } from "framer-motion";
import { ProjectPageSection } from "@/components/sections/project/ProjectPageSection";

const FontCard = ({ font }: { font: FontInfo }) => {
    const letters =
        "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz";

    return (
        <div className="w-full min-w-[min(60vw,_500px)] max-w-[1200px] flex flex-col text-sm md:text-base">
            {/* Font Header */}
            <motion.div
                className="mb-4"
                style={{
                    fontFamily: font.fontFamily,
                }}
            >
                <StyledLink
                    text={font.name}
                    href={font.url}
                    className={`text-3xl font-[${font.fontFamily}]`}
                />
            </motion.div>

            {/* Decorative Line */}
            <div className="w-full h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-transparent mb-6"></div>

            {/* Font Description */}
            <p className="mb-6">{font.description}</p>

            {/* Weights Container */}
            <div className="flex gap-8">
                <div className="flex-1 flex flex-col gap-4 border border-dashed border-current rounded-lg p-4">
                    {[100, 400, 700].map((weight) => (
                        <motion.p
                            key={weight}
                            className="m-0"
                            style={{
                                fontFamily: font.fontFamily,
                                fontWeight: weight,
                                opacity: 0.3 + 0.7 * (weight / 700),
                            }}
                        >
                            {letters}
                        </motion.p>
                    ))}
                </div>
            </div>
        </div>
    );
};

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
        <ProjectPageSection
            id={id}
            title={["TYPOGRAPHY", "TypoGrApHy", "tYPOgraPhy"]}
        >
            {typography.map((font, index) => (
                <FontCard key={index} font={font} />
            ))}
        </ProjectPageSection>
    );
}
