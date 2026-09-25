"use client";

import { OverviewItem, getProjectMedia } from "@/types/project";
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
import Floating3DImage from "@/components/ui/Floating3DImage";
import { projectsData } from "@/data/projects";
import { useMemo, useRef, useState } from "react";
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
    const project = projectsData[projectId];
    const { source, device, mockup: mockupType, mockupColor, boomerang } = getProjectMedia(project, projectId);
    const isMobileProject = device === "mobile";
    const is3DMockup = mockupType === "iphone" || mockupType === "ipad";

    const [isImageVertical, setIsImageVertical] = useState(mockupType === "iphone" || isMobileProject);

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
    const isReversed = !isEven;

    // --- SCROLL SCRUB LOGIC ---
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, {
        stiffness: 70,
        damping: 20,
        restDelta: 0.001
    });

    useAnimationFrame(() => {
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
    const phoneY = useTransform(smoothProgress, [0, 1], isLandscape ? [120, -120] : [50, -50]);
    const textY = useTransform(smoothProgress, [0, 1], isLandscape ? [-40, 40] : [-15, 15]);

    const phoneRotate = useTransform(
        smoothProgress,
        [0, 1],
        [isEven ? 10 : -10, isEven ? -4 : 4]
    );

    // Determine device type: desktop vs mobile
    const isDesktopDevice = device === "desktop" || (!isImageVertical && device !== "mobile");

    const invertedPhoneRotate = useTransform(phoneRotate, (v) => -v);
    // Desktop screenshots use the opposite tilt direction of mobile screenshots
    const finalRotate = isDesktopDevice ? invertedPhoneRotate : phoneRotate;

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
                        : mockupType === "iphone"
                            ? (isEven ? "flex-col sm:flex-row" : "flex-col sm:flex-row-reverse")
                            : "flex-col md:pt-12"
                    }
                `}>

                    {/* --- TEXT HALF --- */}
                    <motion.div
                        style={{ y: textY }}
                        className={`
                            ${isLandscape
                                ? "w-1/2 h-full"
                                : mockupType === "iphone"
                                    ? "sm:w-1/2 sm:h-full"
                                    : ""
                            }
                            px-6 sm:px-0
                            flex flex-col justify-center relative z-10
                            ${!isEven ? "items-end text-right" : "items-start text-left"}
                        `}
                    >
                        <div className="flex flex-col gap-3 md:gap-4 lg:gap-6 w-full px-2 sm:px-0 md:pt-4">
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
                                flex flex-wrap w-full mt-2 md:mt-12
                                ${!isEven ? "justify-end" : "justify-start"}
                                gap-2 md:gap-6
                                *:scale-[0.8] md:*:scale-100
                                ${!isEven ? "*:origin-right" : "*:origin-left"} md:*:origin-center
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

                    {/* --- INTERACTIVE 3D IMAGE HALF --- */}
                    <div className={`${isLandscape
                        ? "w-1/2 lg:w-5/12 h-full"
                        : mockupType === "iphone"
                            ? "w-full min-h-[45vh] sm:w-1/2 sm:min-h-0 sm:h-full lg:w-5/12"
                            : "w-full min-h-[45vh]"
                        } flex items-center justify-center perspective-distant z-20 overflow-visible`}>
                        <Floating3DImage
                            src={source}
                            alt={`${project ? project.name : ""} ${calloutText}`}
                            width={isMobileProject ? 280 : 800}
                            height={isMobileProject ? 600 : 450}
                            baseCursor="grab"
                            align="center"
                            className="relative w-full touch-auto overflow-visible mx-auto"
                            frameClassName={`overflow-visible mx-auto
                                ${mockupType === "iphone"
                                    ? "w-[56%] sm:w-[60%] md:w-[60%] lg:w-full [--mockup-max-w:210px] sm:[--mockup-max-w:260px] md:[--mockup-max-w:260px] lg:[--mockup-max-w:350px] [--mockup-max-h:48svh] sm:[--mockup-max-h:56svh] md:[--mockup-max-h:56svh] lg:[--mockup-max-h:76svh] aspect-[1/1.9]"
                                    : isMobileProject
                                        ? "w-[48%] sm:w-[52%] md:w-full [--mockup-max-w:190px] sm:[--mockup-max-w:230px] md:[--mockup-max-w:300px] [--mockup-max-h:46svh] md:[--mockup-max-h:74svh]"
                                        : mockupType === "ipad"
                                            ? "w-[82%] sm:w-[86%] md:w-full [--mockup-max-w:280px] sm:[--mockup-max-w:420px] md:[--mockup-max-w:840px] [--mockup-max-h:40svh] sm:[--mockup-max-h:50svh] md:[--mockup-max-h:72svh] aspect-[1.43/1]"
                                            : "w-[84%] sm:w-[88%] md:w-full max-w-[320px] sm:max-w-[460px] md:max-w-[760px] max-h-[44svh] md:max-h-[70svh]"
                                }`}
                            frameStyle={
                                mockupType === "iphone"
                                    ? {
                                        width: "100%",
                                        maxWidth: "var(--mockup-max-w, 210px)",
                                        maxHeight: "var(--mockup-max-h, 48svh)",
                                        aspectRatio: "1 / 1.9",
                                    }
                                    : isMobileProject
                                        ? {
                                            width: "100%",
                                            maxWidth: "var(--mockup-max-w, 190px)",
                                            maxHeight: "var(--mockup-max-h, 46svh)",
                                        }
                                        : mockupType === "ipad"
                                            ? {
                                                width: "100%",
                                                maxWidth: "var(--mockup-max-w, 280px)",
                                                maxHeight: "var(--mockup-max-h, 40svh)",
                                                aspectRatio: "1.43 / 1",
                                            }
                                            : undefined
                            }
                            imageClassName="w-full h-full"
                            style={{ y: phoneY }}
                            tilt={is3DMockup ? 0 : finalRotate}
                            bobPhase={index * 0.4}
                            borderOnLandscape={!is3DMockup && !isMobileProject}
                            mockup={mockupType}
                            iphoneColor={mockupColor ?? "cosmic-orange"}
                            ipadColor={mockupColor ?? "silver"}
                            initialTiltY={isReversed ? (mockupType === "ipad" ? 0.15 : 0.16) : (mockupType === "ipad" ? -0.15 : -0.16)}
                            initialTiltZ={mockupType === "iphone" ? (isReversed ? 0.10 : -0.10) : 0}
                            boomerang={boomerang}
                            onImageLoad={({ isVertical }) => {
                                setIsImageVertical(isVertical);
                            }}
                            priority
                        />
                    </div>

                </div>
            </TextBorderAnimation>
        </section>
    );
}
