"use client";

import { motion } from "framer-motion";
import { displayFont } from "@/lib/fonts";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { getRandomIcons } from "@/components/ui/RandomIcons";
import { HiArrowRight } from "react-icons/hi2";

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
        setIconsPrefix(getRandomIcons(Math.ceil(name.length / 2)));
        setIconsSuffix(getRandomIcons(Math.ceil(name.length / 2)));
    }, [name]);

    const renderIcons = (icons: IconType[], reverse: boolean = false) => {
        return (
            <div className={`flex text-6xl gap-4 opacity-40 ${isPortrait ? "flex-col" : "flex-row"}${reverse ? "-reverse" : ""}`}
                style={{
                        fontStyle: "italic",
                        fontSize: isPortrait
                            ? "clamp(2rem, 14vh, 5rem)"
                            : "clamp(4rem, 24vw, 12rem)",
                    }}>
                    {icons.flatMap((Icon, index) => [
                        <Icon key={`icon-${index}`} />,
                        index < icons.length && (
                            <HiArrowRight 
                                key={`arrow-${index}`} 
                                className={` ${isPortrait ? "rotate-90" : ""}`} 
                            />
                        )
                    ])}
                </div>
        );
    }

    return (
        <section
            className={`flex items-center justify-center h-full w-full gap-8
                ${isPortrait ? "flex-row" : "flex-col"} 
                ${className}`}
            id="project-name"
        >
            {/* Start Padding Icons */}
            {renderIcons(iconsPrefix)}

            {/* Name */}
            <motion.div
                className={`flex items-center justify-center whitespace-nowrap leading-none
                    [writing-mode:${isPortrait ? "vertical-rl" : "horizontal-tb"}]
                    ${displayFont}`}
                style={{
                    fontStyle: "italic",
                    fontSize: isPortrait
                        ? "clamp(4rem, 14vh, 10rem)" // Slightly smaller for vertical flow
                        : "clamp(6rem, 18vw, 30rem)",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                {name}
            </motion.div>

            {/* End Padding Icons */}
            {renderIcons(iconsSuffix, true)}
        </section>
    );
}
