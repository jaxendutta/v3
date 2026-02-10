"use client";

import { motion } from "framer-motion";
import { displayFont } from "@/lib/fonts";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { getRandomIcons } from "@/components/ui/RandomIcons";
import { HiArrowRight } from "react-icons/hi2";
import Marquee from "@/components/ui/Marquee";
import { twMerge } from "tailwind-merge";

interface NameSectionProps {
    name: string;
    className?: string;
}

export default function NameSection({ name, className }: NameSectionProps) {
    const [isPortrait, setIsPortrait] = useState(false);
    const [iconsPrefix, setIconsPrefix] = useState<IconType[]>([]);
    const [iconsSuffix, setIconsSuffix] = useState<IconType[]>([]);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
        };
        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => window.removeEventListener("resize", checkOrientation);
    }, []);

    useEffect(() => {
        const count = Math.ceil(name.length / 2);
        setIconsPrefix(getRandomIcons(count));
        setIconsSuffix(getRandomIcons(count));
    }, [name]);

    const renderMarqueeIcons = (icons: IconType[], reverse: boolean = true) => {
        return (
            <div
                className={`
                    relative overflow-hidden z-0 flex-shrink-0
                    ${isPortrait
                        ? "h-auto self-stretch"
                        : "w-full self-stretch"
                    }
                `}
                style={{
                    // SIZING FIX:
                    // I've increased these wrapper sizes to be slightly larger than the icons 
                    // so your original large icons fit comfortably without being cut off.
                    width: isPortrait ? "clamp(3rem, 16vh, 6rem)" : undefined,
                    height: isPortrait ? undefined : "clamp(5rem, 26vw, 14rem)",
                }}
            >
                {/* Absolute positioning breaks the layout loop. 
                   The wrapper (parent div above) sets the rigid size, and this inner div 
                   just fills it. The Marquee content is now isolated from the page layout.
                */}
                <div className="absolute inset-0">
                    <Marquee
                        vertical={isPortrait}
                        direction={reverse ? "right" : "left"}
                        speed={50}
                        className="w-full h-full"
                    >
                        <div className={`
                            flex gap-4 items-center justify-center opacity-40
                            ${isPortrait ? "flex-col py-4" : "flex-row px-4"}
                        `}>
                            {icons.flatMap((Icon, index) => [
                                <Icon
                                    key={`icon-${index}`}
                                    style={{
                                        fontSize: isPortrait
                                            ? "clamp(2rem, 14vh, 5rem)"
                                            : "clamp(4rem, 24vw, 12rem)",
                                    }}
                                />,
                                <HiArrowRight
                                    key={`arrow-${index}`}
                                    className={isPortrait ? "rotate-90" : ""}
                                    style={{
                                        fontSize: isPortrait
                                            ? "clamp(1.5rem, 10vh, 4rem)"
                                            : "clamp(3rem, 18vw, 8rem)",
                                    }}
                                />
                            ])}
                        </div>
                    </Marquee>
                </div>
            </div>
        );
    }

    return (
        <section
            className={twMerge(
                "flex items-center justify-between p-4 overflow-hidden bg-background text-foreground",
                isPortrait
                    ? "flex-row gap-4 w-full h-fit"
                    : "flex-col gap-8 w-fit h-full",
                className
            )}
            id="project-name"
        >
            {/* Start Decoration */}
            {renderMarqueeIcons(iconsPrefix)}

            {/* Name */}
            <motion.div
                className={`flex-1 flex items-center justify-center whitespace-nowrap leading-none z-10
                    [writing-mode:${isPortrait ? "vertical-rl" : "horizontal-tb"}]
                    ${displayFont}`}
                style={{
                    fontStyle: "italic",
                    fontSize: isPortrait
                        ? "clamp(3rem, 12vh, 10rem)"
                        : "clamp(6rem, 25vh, 30rem)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                {name}
            </motion.div>

            {/* End Decoration */}
            {renderMarqueeIcons(iconsSuffix)}
        </section>
    );
}
