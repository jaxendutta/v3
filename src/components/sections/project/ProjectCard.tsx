"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { codeFont, getProjectCardFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import Tag, { SkillTag } from "@/components/ui/Tag";
import RotatingButton from "@/components/ui/RotatingButton";
import FloatingDraggableImage from "@/components/ui/FloatingDraggableImage";
import { renderFormattedTitle } from "@/lib/format";

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
    // Use mobile screenshot vs desktop logic based on the ID
    const isMobileProject = project.screenshotDevice === "mobile";
    const projectLink = `/projects/${id}`;
    const skillCount = Object.values(project.techStack || []).flat().length;

    const titleRef = useRef<HTMLAnchorElement>(null);
    const [wrappedWidth, setWrappedWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = titleRef.current;
        if (!el) return;

        const measure = () => {
            if (window.innerWidth >= 768) {
                setWrappedWidth(undefined);
                return;
            }

            // Temporarily clear inline maxWidth to let the browser lay out words naturally
            const wrapper = el.parentElement;
            if (wrapper) wrapper.style.maxWidth = "none";

            const range = document.createRange();
            range.selectNodeContents(el);
            const rects = Array.from(range.getClientRects()).filter(
                (r) => r.width > 0 && r.height > 0
            );

            if (rects.length > 0) {
                // Group inline rects into visual lines by their vertical position (top coordinate)
                const lineGroups: { top: number; left: number; right: number }[] = [];
                for (const r of rects) {
                    const match = lineGroups.find(
                        (g) => Math.abs(g.top - r.top) < r.height * 0.5
                    );
                    if (match) {
                        match.left = Math.min(match.left, r.left);
                        match.right = Math.max(match.right, r.right);
                    } else {
                        lineGroups.push({ top: r.top, left: r.left, right: r.right });
                    }
                }

                if (lineGroups.length > 1) {
                    // Title wrapped onto multiple lines! Find the longest visual line width:
                    const lineWidths = lineGroups.map((g) => g.right - g.left);
                    const maxLineWidth = Math.ceil(Math.max(...lineWidths));
                    if (maxLineWidth > 0) {
                        const targetWidth = maxLineWidth + 8;
                        if (wrapper) wrapper.style.maxWidth = `${targetWidth}px`;
                        setWrappedWidth(targetWidth);
                        return;
                    }
                }
            }

            if (wrapper) wrapper.style.maxWidth = "";
            setWrappedWidth(undefined);
        };

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [project.label]);

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
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
        >
            <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10 items-center justify-center w-full`}>
                {/* Project Info */}
                <div className={`w-full md:w-[40vw] flex flex-col gap-1 md:gap-4 items-center ${reversed ? `md:items-start md:text-left ${chain ? "pl-4" : ""}` : `md:items-end md:text-right ${chain ? "pr-4" : ""}`}`}>
                    <div className={`w-full flex ${reversed ? "flex-row text-right md:text-left" : "flex-row-reverse text-left md:text-right"} gap-6 md:gap-8 items-center justify-center ${chain ? "pr-4" : ""}`}>
                        <div
                            className="w-fit flex flex-wrap items-center gap-x-1.5 md:gap-x-3 gap-y-0 md:gap-y-0.5"
                            style={wrappedWidth ? { maxWidth: `${wrappedWidth}px` } : undefined}
                        >
                            <Link
                                ref={titleRef}
                                href={projectLink}
                                className={`text-[40px] sm:text-[68px] md:text-7xl lg:text-8xl hover:text-accent transition-colors no-underline! leading-9 md:leading-16 lg:leading-normal ${project.cardFont || getProjectCardFont(id)} ${reversed ? "pl-2" : "pr-2"
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
                        <div className={`md:hidden ${chain ? (reversed ? "pr-4" : "pl-4") : ""}`}>{exploreButton}</div>
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
                                <Tag text={`+${skillCount - skillLimit} more`} glowOnHover={true} />
                            )}
                    </div>

                    <div className={`hidden md:flex`}>{exploreButton}</div>
                </div>

                {/* Project Image */}
                <Link
                    href={projectLink}
                    className={`w-full ${isMobileProject ? "md:w-2/5" : "md:w-3/5"} relative`}
                >
                    <FloatingDraggableImage
                        src={project.image ?? `/${id}.png`}
                        alt={project.name}
                        width={isMobileProject ? 280 : 800}
                        height={isMobileProject ? 600 : 450}
                        baseCursor="pointer"
                        className={`relative mx-auto w-full touch-auto ${isMobileProject ? (reversed ? "-rotate-5" : "rotate-5") : (reversed ? "-rotate-3" : "rotate-3")}`}
                        frameClassName={`mx-auto ${isMobileProject
                            ? "w-full max-w-[200px] md:max-w-[280px]"
                            : "w-full max-w-[800px]"
                            }`}
                        imageClassName="w-full h-auto"
                        style={{
                            rotateX: 4,
                        }}
                        tilt={isMobileProject ? (reversed ? -8 : 8) : 0}
                        bobPhase={reversed ? 0.8 : 0}
                        borderOnLandscape={!isMobileProject}
                        priority
                    />
                </Link>
            </div>
        </motion.div>
    );
}
