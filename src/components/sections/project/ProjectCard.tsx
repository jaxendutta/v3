"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project, getProjectMedia } from "@/types/project";
import { csDeviousItalicFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import Tag, { SkillTag } from "@/components/ui/Tag";
import RotatingButton from "@/components/ui/RotatingButton";
import Floating3DImage from "@/components/ui/Floating3DImage";
import { renderFormattedTitle } from "@/lib/format";
import { useTightWrappedWidth } from "@/hooks/useTightWrappedWidth";

interface ProjectCardProps {
    id: string;
    project: Project;

    skillLimit?: number;
    mobileSkillLimit?: number;
    reversed?: boolean;
    chain?: boolean;
    className?: string;
}

export default function ProjectCard({
    id,
    project,
    skillLimit = 12,
    mobileSkillLimit = 6,
    reversed = false,
    chain = false,
    className = "max-w-[90vw] mx-auto mt-4 mb-6 md:my-8",
}: ProjectCardProps) {
    const { source, device, mockup: mockupType, mockupColor, boomerang } =
        getProjectMedia(project, id);
    const isMobileProject = device === "mobile";
    const projectLink = `/projects/${id}`;
    const skillCount = Object.values(project.techStack || []).flat().length;
    const effectiveMobileLimit = Math.min(mobileSkillLimit, skillLimit);

    // If there is only 1 overflow tag beyond the limit, show it directly instead of "+1 more"
    const mobileShowCount = skillCount === effectiveMobileLimit + 1 ? effectiveMobileLimit + 1 : effectiveMobileLimit;
    const desktopShowCount = skillCount === skillLimit + 1 ? skillLimit + 1 : skillLimit;

    const { ref: titleRef, wrappedWidth } = useTightWrappedWidth<HTMLAnchorElement>(project.label);

    const exploreButton = (
        <RotatingButton
            className={reversed ? "md:rotate-180" : ""}
            centerIcon={project.icon}
            href={projectLink}
            texts={["Explore", "Learn", "More"]}
            size={75}
            fontSize={11}
        />
    );

    return (
        <motion.div
            className={`${className} overflow-visible`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
        >
            <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-4 md:gap-6 lg:gap-8 xl:gap-10 items-center justify-center w-full max-w-full overflow-visible`}>
                {/* Project Info */}
                <div className={`w-full min-w-0 max-w-full ${isMobileProject ? "md:w-1/2 xl:w-3/5" : "md:w-[46%] lg:w-[45%]"} flex flex-col gap-1 md:gap-4 items-center ${reversed ? `md:items-start md:text-left ${chain ? "pl-4" : ""}` : `md:items-end md:text-right ${chain ? "pr-4" : ""}`}`}>
                    <div className={`w-full min-w-0 max-w-full flex ${reversed ? "flex-row" : "flex-row-reverse"} md:flex-row gap-3 sm:gap-6 md:gap-8 items-center justify-center ${reversed ? "md:justify-start" : "md:justify-end"} ${chain ? "pr-4" : ""}`}>
                        <div
                            className={`w-fit min-w-0 max-w-[calc(100%-85px)] md:max-w-full flex flex-wrap items-center ${reversed ? "justify-end text-right md:justify-start md:text-left" : "justify-start text-left md:justify-end md:text-right"} gap-x-1.5 md:gap-x-3 gap-y-0 md:gap-y-0.5`}
                            style={wrappedWidth ? { maxWidth: `min(${wrappedWidth}px, 100%)` } : undefined}
                        >
                            <Link
                                ref={titleRef}
                                href={projectLink}
                                className={`text-[40px] sm:text-[48px] md:text-7xl lg:text-8xl hover:text-accent transition-colors no-underline! leading-9 md:leading-16 lg:leading-22 wrap-break-word ${reversed ? "text-right md:text-left" : "text-left md:text-right"} ${project.cardFont || csDeviousItalicFont} px-2 md:px-0 ${reversed ? "md:pl-2" : "md:pr-2"
                                    }`}
                            >
                                {renderFormattedTitle(project.label)}
                            </Link>
                            {!project.date.end && (
                                <span className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-accent shrink-0 select-none">
                                    [ IN PROGRESS ]
                                </span>
                            )}
                        </div>
                        <div className={`md:hidden shrink-0 ${chain ? (reversed ? "pr-4" : "pl-4") : ""}`}>{exploreButton}</div>
                    </div>

                    <div className={`flex flex-wrap gap-2 my-2 justify-center ${reversed ? "md:justify-start" : "md:justify-end"}`}>
                        {project.techStack &&
                            Object.values(project.techStack)
                                .flat()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .slice(0, desktopShowCount)
                                .map((tech, i) => (
                                    <SkillTag
                                        key={i}
                                        skill={tech.name}
                                        className={i >= mobileShowCount ? "hidden md:inline-flex" : ""}
                                    />
                                ))}

                        {/* Show more indicator on phones/mobile only when 2+ tags are hidden beyond limit */}
                        {project.techStack && skillCount > effectiveMobileLimit + 1 && (
                            <Tag
                                className="md:hidden"
                                text={`+${skillCount - effectiveMobileLimit} more`}
                                glowOnHover={false}
                            />
                        )}

                        {/* Show more indicator on desktop only when 2+ tags are hidden beyond limit */}
                        {project.techStack && skillCount > skillLimit + 1 && (
                            <Tag
                                className="hidden md:inline-flex"
                                text={`+${skillCount - skillLimit} more`}
                                glowOnHover={false}
                            />
                        )}
                    </div>

                    <div className={`hidden md:flex`}>{exploreButton}</div>
                </div>

                {/* Project Image */}
                {(() => {
                    const is3DMockup = mockupType === "iphone" || mockupType === "ipad";

                    return (
                        <Link
                            href={projectLink}
                            className={`w-full min-w-0 max-w-full ${isMobileProject ? "md:w-1/2 lg:w-1/3 pt-4 sm:pt-6 md:pt-0" : "md:w-[54%] lg:w-[55%]"
                                } ${mockupType === "ipad" ? "py-6 sm:py-8 md:py-0" : ""
                                } relative overflow-visible flex items-center justify-center ${isMobileProject ? (reversed ? "md:justify-end" : "md:justify-start") : ""
                                }`}
                        >
                            <Floating3DImage
                                src={source}
                                alt={project.name}
                                width={isMobileProject ? 280 : 800}
                                height={isMobileProject ? 600 : 450}
                                baseCursor="pointer"
                                align={isMobileProject ? (reversed ? "end" : "start") : "center"}
                                className={`relative w-full touch-auto overflow-visible ${isMobileProject ? (reversed ? "md:justify-end" : "md:justify-start") : "mx-auto"}`}
                                frameClassName={`overflow-visible 
                                    ${isMobileProject
                                        ? (reversed ? "mx-auto md:ml-auto md:mr-0" : "mx-auto md:mr-auto md:ml-0")
                                        : "mx-auto"
                                    }
                                    ${mockupType === "iphone"
                                        ? "w-[54%] sm:w-[58%] md:w-full [--mockup-max-w:205px] sm:[--mockup-max-w:240px] md:[--mockup-max-w:360px] [--mockup-max-h:54svh] sm:[--mockup-max-h:60svh] md:[--mockup-max-h:85svh] aspect-[1/1.9] mt-2 sm:mt-4 md:mt-0"
                                        : isMobileProject
                                            ? "w-[46%] sm:w-[48%] md:w-full [--mockup-max-w:180px] sm:[--mockup-max-w:215px] md:[--mockup-max-w:280px] [--mockup-max-h:52svh] md:[--mockup-max-h:85svh]"
                                            : mockupType === "ipad"
                                                ? "w-[80%] sm:w-[84%] md:w-full [--mockup-max-w:270px] sm:[--mockup-max-w:400px] md:[--mockup-max-w:960px] [--mockup-max-h:42svh] sm:[--mockup-max-h:52svh] md:[--mockup-max-h:75svh] aspect-[1.43/1]"
                                                : "w-[82%] sm:w-[85%] md:w-full max-w-[310px] sm:max-w-[440px] md:max-w-[760px]"
                                    }`}
                                frameStyle={
                                    mockupType === "iphone"
                                        ? {
                                            width: "100%",
                                            maxWidth: "var(--mockup-max-w, 205px)",
                                            maxHeight: "var(--mockup-max-h, 54svh)",
                                            aspectRatio: "1 / 1.9",
                                        }
                                        : isMobileProject
                                            ? {
                                                width: "100%",
                                                maxWidth: "var(--mockup-max-w, 180px)",
                                                maxHeight: "var(--mockup-max-h, 52svh)",
                                            }
                                            : mockupType === "ipad"
                                                ? {
                                                    width: "100%",
                                                    maxWidth: "var(--mockup-max-w, 270px)",
                                                    maxHeight: "var(--mockup-max-h, 42svh)",
                                                    aspectRatio: "1.43 / 1",
                                                }
                                                : undefined
                                }
                                imageClassName="w-full h-full"
                                tilt={is3DMockup ? 0 : (reversed ? -8 : 8)}
                                bobPhase={reversed ? 0.8 : 0}
                                borderOnLandscape={!is3DMockup && !isMobileProject}
                                mockup={mockupType}
                                iphoneColor={mockupColor ?? "cosmic-orange"}
                                ipadColor={mockupColor ?? "silver"}
                                initialTiltY={reversed ? (mockupType === "ipad" ? 0.15 : 0.16) : (mockupType === "ipad" ? -0.15 : -0.16)}
                                initialTiltZ={mockupType === "iphone" ? (reversed ? 0.10 : -0.10) : 0}
                                boomerang={boomerang}
                                priority
                            />
                        </Link>
                    );
                })()}
            </div>
        </motion.div>
    );
}
