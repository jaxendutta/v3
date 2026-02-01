// src/components/sections/project/ProjectCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProjectData } from "@/types/project";
import { displayFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import Tag from "@/components/ui/Tag";
import RotatingButton from "@/components/ui/RotatingButton";

interface ProjectCardProps {
    id: string;
    project: ProjectData;

    skillLimit?: number;
    reversed?: boolean;
}

export default function ProjectCard({
    id,
    project,
    skillLimit = 8,
    reversed = false,
}: ProjectCardProps) {
    // Use mobile screenshot vs desktop logic based on the ID
    const isMobileProject = project.screenshotDevice === "mobile";
    const projectLink = `/projects/${id}`;
    const skillCount = Object.values(project.techStack || []).flat().length;

    const exploreButton = (
        <RotatingButton
            className={`hidden md:block ${reversed ? "md:rotate-180" : ""}`}
            centerIcon={project.icon}
            href={projectLink}
            texts={["Explore", "Learn", "More"]}
            size={75}
            fontSize={11}
        />
    );

    return (
        <motion.div
            className="max-w-[90vw] mx-auto mt-4 mb-6 md:my-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
        >
            <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10 items-center`}>
                {/* Project Info */}
                <div className={`w-full md:w-1/2 flex flex-col gap-1 md:gap-4 items-center ${reversed ? "md:items-start md:text-left pl-4" : "md:items-end md:text-right pr-4"}`}>
                    <div className={`w-full flex ${reversed ? "flex-row text-left" : "flex-row-reverse text-right"} gap-4 items-center justify-between`}>
                        <Link
                            href={projectLink}
                            className={`text-xl md:text-5xl lg:text-6xl ${displayFont} italic hover:text-accent transition-colors`}
                            style={{
                                textDecoration: "none",
                                fontStyle: "italic",
                            }}
                        >
                            {project.name}
                            {project.subtitle && (
                                <span className="text-xl md:text-3xl">
                                    {` ${project.subtitle}`}
                                </span>
                            )}
                        </Link>
                        <div className="md:hidden">{exploreButton}</div>
                    </div>

                    <div className={`flex flex-wrap gap-2 my-2 justify-center ${reversed ? "md:justify-start" : "md:justify-end"}`}>
                        {project.techStack &&
                            Object.values(project.techStack)
                                .flat()
                                .slice(0, skillLimit)
                                .map((tech, i) => <Tag key={i} text={tech.name} />)}

                        {/* Show more indicator if technologies are truncated */}
                        {project.techStack &&
                            Object.values(project.techStack).flat().length > skillLimit && (
                                <Tag text={`+${skillCount - skillLimit} more`} glowOnHover={true} />
                            )}
                    </div>

                    <div className="hidden md:flex">{exploreButton}</div>
                </div>

                {/* Project Image */}
                <Link
                    href={projectLink}
                    className={`w-full md:w-2/5 relative ${isMobileProject ? (reversed ? "-rotate-5" : "rotate-5") : ""}`}
                >
                    <Image
                        src={`/assets/${id}.png`}
                        alt={project.name}
                        width={isMobileProject ? 280 : 800}
                        height={isMobileProject ? 600 : 450}
                        className={`relative mx-auto w-full h-auto ${isMobileProject ? "max-w-[200px] md:max-w-[280px]" : "max-w-[800px] border border-[var(--color-text)] rounded-sm"}`}
                        style={{
                            objectFit: "contain",
                        }}
                        priority
                    />
                </Link>
            </div>
        </motion.div>
    );
}
