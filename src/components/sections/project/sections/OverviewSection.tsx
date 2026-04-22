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
import { useEffect, useMemo, useRef, useState } from "react";
import { serifFont } from "@/lib/fonts";
import Image from "next/image";

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

    // Shared hover bob value used by both the image and its shadow.
    const hoverOffset = useMotionValue(0);

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

        const bobDurationInSeconds = 4;
        const phase = (t / 1000) * ((Math.PI * 2) / bobDurationInSeconds) + index * 0.4;
        hoverOffset.set(Math.sin(phase) * 12);
    });

    // --- RESPONSIVE PARALLAX KINEMATICS ---
    const phoneY = useTransform(smoothProgress, [0, 1], isLandscape ? [150, -150] : [60, -60]);
    const textY = useTransform(smoothProgress, [0, 1], isLandscape ? [-40, 40] : [-15, 15]);

    const phoneRotate = useTransform(
        smoothProgress,
        [0, 1],
        [isEven ? 12 : -12, isEven ? -4 : 4]
    );

    const shadowOpacity = useTransform(hoverOffset, [-12, 12], [0.3, 0.5]);
    const shadowBlur = useTransform(hoverOffset, [-12, 12], [34, 16]);
    const shadowScaleX = useTransform(hoverOffset, [-12, 12], [0.82, 1.04]);
    const shadowScaleY = useTransform(hoverOffset, [-12, 12], [0.7, 0.95]);
    const shadowX = useTransform(phoneRotate, [-12, 12], [-14, 14]);
    const sideShadowOpacity = useTransform(hoverOffset, [-12, 12], [0.42, 0.68]);
    const sideShadowBlur = useTransform(hoverOffset, [-12, 12], [26, 10]);
    const sideShadowScaleX = useTransform(hoverOffset, [-12, 12], [0.92, 1.08]);
    const sideShadowScaleY = useTransform(hoverOffset, [-12, 12], [0.88, 1.04]);
    const sideShadowX = useTransform(phoneRotate, [-12, 12], [-1, 2]);
    const sideShadowY = useTransform(hoverOffset, [-12, 12], [8, -8]);
    const shadowFilter = useTransform(shadowBlur, (v) => `blur(${v}px)`);
    const sideShadowFilter = useTransform(sideShadowBlur, (v) => `blur(${v}px)`);
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
                className="w-full h-full relative overflow-hidden"
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

                        {/* 1. SCROLL & DRAG CONTAINER */}
                        {/* Handles the scroll-based movement and the physics for dragging */}
                        <motion.div
                            drag
                            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            dragElastic={0.4}
                            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                            style={{
                                y: phoneY,
                                rotateZ: phoneRotate,
                                rotateX: isLandscape ? 5 : 0,
                                cursor: "grab"
                            }}
                            className={`relative w-full h-full touch-auto`}
                        >

                            {/* 2. CONTINUOUS HOVER & SHADOW CONTAINER */}
                            {/* Handles the endless floating bob and dynamic shadow casting */}
                            <motion.div
                                style={{ y: hoverOffset }}
                                className="w-full h-full relative flex items-center justify-center"
                            >
                                <div
                                    className="relative z-30 flex shrink-0 items-center justify-center"
                                    style={{ width: `${renderedImageWidth}px`, height: `${renderedImageHeight}px` }}
                                >
                                    <motion.div
                                        aria-hidden
                                        style={{
                                            opacity: isImageVertical ? sideShadowOpacity : shadowOpacity,
                                            filter: isImageVertical ? sideShadowFilter : shadowFilter,
                                            scaleX: isImageVertical ? sideShadowScaleX : shadowScaleX,
                                            scaleY: isImageVertical ? sideShadowScaleY : shadowScaleY,
                                            x: isImageVertical ? sideShadowX : shadowX,
                                            y: isImageVertical ? sideShadowY : 0,
                                        }}
                                        className={isImageVertical
                                            ? "absolute top-[58%] left-[84%] z-0 h-[68%] w-[30%] -translate-y-1/2 rounded-[999px] bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none"
                                            : "absolute bottom-[-7%] left-1/2 z-0 h-[15%] w-[62%] -translate-x-1/2 rounded-[999px] bg-black/90 pointer-events-none"
                                        }
                                    />
                                    <Image
                                        src={`/${projectId}.png`}
                                        alt={`${calloutText} interface`}
                                        width={imageSize.width}
                                        height={imageSize.height}
                                        draggable={false}
                                        className={`object-contain relative z-10 h-full w-full cursor-grab active:cursor-grabbing touch-none ${!isImageVertical ? "border border-foreground rounded-lg" : ""}`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                        onDragStart={(event) => event.preventDefault()}
                                        onLoadingComplete={(img) => {
                                            setIsImageVertical(img.naturalHeight > img.naturalWidth);
                                            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                                setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
                                            }
                                        }}
                                        priority
                                    />
                                </div>
                            </motion.div>

                        </motion.div>

                    </div>

                </div>
            </TextBorderAnimation>
        </section>
    );
}
