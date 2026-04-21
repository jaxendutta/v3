"use client";

import { OverviewItem } from "@/types/project";
import { Social } from "@/types/contact";
import { motion } from "framer-motion";
import TextBorderAnimation from "@/components/ui/TextBorder";
import ProjectButton from "@/components/ui/ProjectButton";
import { useMemo } from "react";
import { serifFont } from "@/lib/fonts";

interface OverviewSectionProps {
    overview: OverviewItem[][];
    links?: Social[];
    isLandscape?: boolean;
}

export default function OverviewSection({ overview, links, isLandscape = true }: OverviewSectionProps) {
    return (
        <>
            {overview.map((column, index) => (
                <OverviewSlide
                    key={index}
                    items={column}
                    links={links}
                    isLandscape={isLandscape}
                />
            ))}
        </>
    );
}

function OverviewSlide({ items, links, isLandscape }: { items: OverviewItem[], links?: Social[], isLandscape: boolean }) {

    const { calloutText, bodyContent, titleContent } = useMemo(() => {
        const calloutItem = items.find(item => item.className);
        const bodyItem = items.find(item => !item.className);

        const rawCallout = calloutItem ? calloutItem.content : "PROJECT OVERVIEW";

        return {
            calloutText: rawCallout,
            titleContent: rawCallout,
            bodyContent: bodyItem ? bodyItem.content : "",
        };
    }, [items]);

    return (
        <section
            className={`
                relative bg-background text-foreground
                snap-center shrink-0 overflow-hidden 
                w-screen flex items-center justify-center
                ${isLandscape ? "h-full" : "h-[calc(100vh-120px)]"}
            `}
        >
            <TextBorderAnimation
                text={calloutText}
                fontSize={20}
                speed={60}
                className="w-full h-full p-6 md:p-12"
            >
                <motion.div
                    className="flex flex-col items-center text-center gap-6 md:gap-10 p-4 md:p-12 max-w-4xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className={`text-lg md:text-2xl ${serifFont} italic leading-relaxed text-muted-foreground max-w-[60vw] md:max-w-2xl`}>
                        {bodyContent}
                    </p>

                    {links && links.length > 0 && (
                        <div className="flex flex-wrap justify-evenly gap-4 pt-8 border-t border-border w-full">
                            {links.map((link, linkIndex) => (
                                <ProjectButton
                                    key={linkIndex}
                                    link={link}
                                    index={linkIndex}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </TextBorderAnimation>
        </section>
    );
}
