"use client";

import { motion } from "framer-motion";
import { displayFont } from "@/lib/fonts";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { getRandomIcons } from "@/components/ui/RandomIcons";
import { HiArrowRight } from "react-icons/hi2";
import Marquee from "@/components/ui/Marquee";

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
        // Keep your original logic for count
        const count = Math.ceil(name.length / 2);
        setIconsPrefix(getRandomIcons(count));
        setIconsSuffix(getRandomIcons(count));
    }, [name]);

    const renderMarqueeIcons = (icons: IconType[], reverse: boolean = true) => {
        const IconGroup = () => (
            <div className={`
                flex gap-4 items-center justify-center opacity-40
                ${isPortrait ? "flex-col" : "flex-row"}
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
                    // Always show arrow in marquee since it loops
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
        );

        return (
            <div className={`
                relative flex items-center justify-center
                ${isPortrait
                    ? "h-full"
                    : "w-screen"
                }
            `}>
                <Marquee
                    vertical={isPortrait}
                    direction={reverse ? "right" : "left"} // Right maps to Reverse/Up depending on vertical
                    speed={50}
                    className="w-full h-full"
                >
                    <IconGroup />
                </Marquee>
            </div>
        );
    }

    return (
        <section
            className={`flex items-center justify-between py-4 md:p-8 overflow-hidden
                ${isPortrait ? "flex-row gap-4 w-full !h-fit" : "flex-col gap-8 !w-fit h-full"} 
                ${className}`}
            id="project-name"
        >
            {/* Start Decoration */}
            <div className="w-full max-h-[100vh] overflow-visible">
                {renderMarqueeIcons(iconsPrefix)}
            </div>

            {/* Name */}
            <motion.div
                className={`flex-1 flex items-center justify-center whitespace-nowrap leading-none z-10
                    [writing-mode:${isPortrait ? "vertical-rl" : "horizontal-tb"}]
                    ${displayFont}`}
                style={{
                    fontStyle: "italic",
                    fontSize: isPortrait
                        ? "clamp(4rem, 14vh, 10rem)"
                        : "clamp(6rem, 18vw, 30rem)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                {name}
            </motion.div>

            {/* End Decoration */}
            <div className="w-full max-h-[100vh] overflow-visible">
                {renderMarqueeIcons(iconsSuffix)}
            </div>
        </section>
    );
}
