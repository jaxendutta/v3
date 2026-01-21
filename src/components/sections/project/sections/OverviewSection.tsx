// src/components/sections/project/sections/OverviewSection.tsx
"use client";

import {
    OverviewItem as OverviewSectionType,
    ProjectLink,
} from "@/types/project";
import { motion } from "framer-motion";
import { codeFont } from "@/lib/fonts";
import ProjectButton from "@/components/ui/ProjectButton";
import { ProjectPageSection } from "../ProjectPageSection";

interface OverviewSectionProps {
    overview: OverviewSectionType[][];
    links: ProjectLink[];
}

export default function OverviewSection({
    overview,
    links,
}: OverviewSectionProps) {
    return (
        <ProjectPageSection title={[]} className="flex-none" id="overview">
            {overview.map((section, sectionIndex) => (
                <div
                    key={sectionIndex}
                    className="w-screen h-screen flex flex-col items-center justify-center snap-start"
                >
                    {section.map(
                        (subsection: OverviewSectionType, index: number) => (
                            <motion.div
                                key={index}
                                className={`mb-8 max-w-[70%] flex flex-col items-center ${codeFont}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div
                                    className={`leading-relaxed text-center ${subsection.className}`}
                                >
                                    {subsection.content}
                                </div>
                            </motion.div>
                        )
                    )}
                    {/* Project Links */}
                    {links.length > 0 && (
                        <div className="mt-4 w-full flex justify-evenly flex-wrap">
                            {links.map((link, linkIndex) => (
                                <ProjectButton
                                    key={linkIndex}
                                    link={link}
                                    index={linkIndex}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </ProjectPageSection>
    );
}
