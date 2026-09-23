"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project, getProjectMedia } from "@/types/project";
import { getProjectCardFont } from "@/lib/fonts";
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
    reversed?: boolean;
    chain?: boolean;
    className?: string;
}

export default function ProjectCard({
    id,
    project,
    skillLimit = 12,
    reversed = false,
    chain = false,
    className = "max-w-[90vw] mx-auto mt-4 mb-6 md:my-8",
}: ProjectCardProps) {
    const { source, device, mockup: mockupType, mockupColor, boomerang } =
        getProjectMedia(project, id);
    const isMobileProject = device === "mobile";
    const projectLink = `/projects/${id}`;
    const skillCount = Object.values(project.techStack || []).flat().length;

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
                                className={`text-[40px] sm:text-[48px] md:text-7xl lg:text-8xl hover:text-accent transition-colors no-underline! leading-9 md:leading-16 lg:leading-22 wrap-break-word ${reversed ? "text-right md:text-left" : "text-left md:text-right"} ${project.cardFont || getProjectCardFont(id)} px-2 md:px-0 ${reversed ? "md:pl-2" : "md:pr-2"
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
                                .slice(0, skillLimit)
                                .map((tech, i) => <SkillTag key={i} skill={tech.name} />)}

                        {/* Show more indicator if technologies are truncated */}
                        {project.techStack &&
                            Object.values(project.techStack).flat().length > skillLimit && (
                                <Tag text={`+${skillCount - skillLimit} more`} glowOnHover={false} />
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
                                        ? "w-[66%] sm:w-[60%] md:w-full max-w-[250px] sm:max-w-[280px] md:max-w-[380px] max-h-[60svh] md:max-h-[90svh] aspect-[1/1.9] mt-2 sm:mt-4 md:mt-0"
                                        : isMobileProject
                                            ? "w-[52%] sm:w-[48%] md:w-full max-w-[190px] md:max-w-[300px] max-h-[60svh] md:max-h-[90svh]"
                                            : mockupType === "ipad"
                                                ? "w-[84%] sm:w-[86%] md:w-full max-w-[300px] sm:max-w-[460px] md:max-w-[1100px] aspect-[1.43/1]"
                                                : "w-[84%] sm:w-[88%] md:w-full max-w-[320px] sm:max-w-[500px] md:max-w-[800px]"
                                    }`}
                                frameStyle={
                                    mockupType === "iphone"
                                        ? { maxWidth: "min(380px, 90svh)", maxHeight: "90svh" }
                                        : isMobileProject
                                            ? { maxWidth: "min(300px, 90svh)", maxHeight: "90svh" }
                                            : mockupType === "ipad"
                                                ? { maxWidth: "min(1100px, 80svh)", maxHeight: "80svh" }
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
