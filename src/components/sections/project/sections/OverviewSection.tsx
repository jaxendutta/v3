"use client";

import { OverviewItem } from "@/types/project";
import { Social } from "@/types/contact";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useAnimationFrame
} from "framer-motion";
import TextBorderAnimation from "@/components/ui/TextBorder";
import ProjectButton from "@/components/ui/ProjectButton";
import FloatingDraggableImage from "@/components/ui/FloatingDraggableImage";
import { useEffect, useMemo, useRef, useState } from "react";
import { serifFont } from "@/lib/fonts";

interface OverviewSectionProps {
    projectId: keyof typeof import("@/data/projects").projectsData;
    overview: OverviewItem[][];
    links?: Social[];
    isLandscape?: boolean;
}

export default function OverviewSection({ projectId, overview, links, isLandscape = true }: OverviewSectionProps) {
    return (
        <>
            {overview.map((column, index) => (
                <OverviewSlide
                    key={index}
                    index={index}
                    projectId={projectId}
                    items={column}
                    links={links}
                    isLandscape={isLandscape}
                />
            ))}
        </>
    );
}

function OverviewSlide({ items, links, isLandscape, index, projectId }: { items: OverviewItem[], links?: Social[], isLandscape: boolean, index: number, projectId: keyof typeof import("@/data/projects").projectsData }) {
    const slideRef = useRef<HTMLElement>(null);
    const [imageSize, setImageSize] = useState({ width: 1200, height: 1200 });
    const [viewport, setViewport] = useState({ width: 1280, height: 720 });

    const { calloutText, bodyContent } = useMemo(() => {
        const calloutItem = items.find(item => item.className);
        const bodyItem = items.find(item => !item.className);
        return {
            calloutText: calloutItem ? calloutItem.content : "OVERVIEW",
            bodyContent: bodyItem ? bodyItem.content : "",
        };
    }, [items]);

    const sentences = useMemo(() => {
        // Split only on ". " so abbreviations like "Next.js" remain intact.
        const parts = bodyContent.match(/.*?(?:\. |$)/g)?.map(part => part.trim()).filter(Boolean);
        return parts && parts.length > 0 ? parts : [bodyContent];
    }, [bodyContent]);

    const isEven = index % 2 === 0;

    // Calculate if image is longer in height than width (for portrait vs landscape styling)
    const [isImageVertical, setIsImageVertical] = useState(false);

    useEffect(() => {
        const syncViewport = () => {
            setViewport({ width: window.innerWidth, height: window.innerHeight });
        };

        syncViewport();
        window.addEventListener("resize", syncViewport);
        return () => window.removeEventListener("resize", syncViewport);
    }, []);

    // --- SCROLL SCRUB LOGIC ---
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, {
        stiffness: 70,
        damping: 20,
        restDelta: 0.001
    });

    useAnimationFrame((t) => {
        if (!slideRef.current) return;
        const rect = slideRef.current.getBoundingClientRect();

        if (isLandscape) {
            const windowWidth = window.innerWidth;
            const totalScrollDistance = windowWidth + rect.width;
            const currentScroll = windowWidth - rect.left;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollDistance));
            rawProgress.set(progress);
        } else {
            const windowHeight = window.innerHeight;
            const totalScrollDistance = windowHeight + rect.height;
            const currentScroll = windowHeight - rect.top;
            const progress = Math.max(0, Math.min(1, currentScroll / totalScrollDistance));
            rawProgress.set(progress);
        }

    });

    // --- RESPONSIVE PARALLAX KINEMATICS ---
    const phoneY = useTransform(smoothProgress, [0, 1], isLandscape ? [150, -150] : [60, -60]);
    const textY = useTransform(smoothProgress, [0, 1], isLandscape ? [-40, 40] : [-15, 15]);

    const phoneRotate = useTransform(
        smoothProgress,
        [0, 1],
        [isEven ? 12 : -12, isEven ? -4 : 4]
    );

    const imageMaxWidthPx = (isImageVertical
        ? (isLandscape ? 0.34 : 0.72)
        : (isLandscape ? 0.48 : 0.92)) * viewport.width;
    const imageMaxHeightPx = (isImageVertical
        ? (isLandscape ? 0.72 : 0.46)
        : (isLandscape ? 0.72 : 0.52)) * viewport.height;
    const imageScale = Math.min(
        1,
        imageMaxWidthPx / imageSize.width,
        imageMaxHeightPx / imageSize.height
    );
    const renderedImageWidth = Math.max(1, Math.round(imageSize.width * imageScale));
    const renderedImageHeight = Math.max(1, Math.round(imageSize.height * imageScale));

    return (
        <section
            ref={slideRef}
            className={`
                relative bg-background text-foreground
                snap-center shrink-0 w-screen flex items-center justify-center
                ${isLandscape ? "h-full" : "h-[calc(100vh-120px)]"}
            `}
        >
            <TextBorderAnimation
                text={calloutText}
                fontSize={20}
                speed={60}
                borderOnTop={false}
                className="w-full h-full relative overflow-visible"
            >
                <div className={`
                    w-full h-full flex items-center justify-evenly max-w-[1600px] mx-auto
                    p-6 sm:p-8 md:p-16 lg:p-24
                    ${isLandscape
                        ? (isEven ? "flex-row" : "flex-row-reverse")
                        : "flex-col gap-8 md:pt-12"
                    }
                `}>

                    {/* --- TEXT HALF --- */}
                    <motion.div
                        style={{ y: textY }}
                        className={`
                            ${isLandscape ? "w-1/2 h-full" : "w-full"} 
                            px-6 sm:px-0
                            flex flex-col justify-center relative z-10
                            ${!isEven ? "items-end text-right" : "items-start text-left"}
                        `}
                    >
                        <div className="flex flex-col gap-3 md:gap-8 w-full px-2 sm:px-0 pt-4 md:pt-0">
                            {sentences.map((sentence, i) => {
                                const cascadeStep = isLandscape ? 2.5 : 0.75;

                                return (
                                    <p
                                        key={i}
                                        className={`text-[13px] sm:text-base md:text-xl lg:text-3xl ${serifFont} italic leading-relaxed text-foreground tracking-tight`}
                                        style={{
                                            marginLeft: !isEven ? 0 : `${i * cascadeStep}rem`,
                                            marginRight: !isEven ? `${i * cascadeStep}rem` : 0,
                                        }}
                                    >
                                        {sentence.trim()}
                                    </p>
                                );
                            })}
                        </div>

                        {links && links.length > 0 && (
                            <div className={`
                                flex flex-wrap w-full mt-6 md:mt-12
                                ${!isEven ? "justify-end" : "justify-start"}
                                gap-2 md:gap-6
                                [&>*]:scale-[0.8] md:[&>*]:scale-100
                                ${!isEven ? "[&>*]:origin-right" : "[&>*]:origin-left"} md:[&>*]:origin-center
                            `}>
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

                    {/* --- INTERACTIVE IMAGE HALF --- */}
                    <div className={`${isLandscape ? "w-5/12 h-full" : "w-full min-h-1/2"} flex items-center justify-center perspective-[1200px] z-20`}>

                        <FloatingDraggableImage
                            src={`/${projectId}.png`}
                            alt={`${calloutText} interface`}
                            className="relative w-full h-full touch-auto"
                            style={{
                                y: phoneY,
                                rotateZ: phoneRotate,
                                rotateX: isLandscape ? 5 : 0,
                            }}
                            tilt={phoneRotate}
                            bobPhase={index * 0.4}
                            frameStyle={{ width: `${renderedImageWidth}px`, height: `${renderedImageHeight}px` }}
                            imageClassName="h-full w-full"
                            onImageLoad={({ width, height, isVertical }) => {
                                setIsImageVertical(isVertical);
                                setImageSize({ width, height });
                            }}
                            priority
                        />

                    </div>

                </div>
            </TextBorderAnimation>
        </section>
    );
}
