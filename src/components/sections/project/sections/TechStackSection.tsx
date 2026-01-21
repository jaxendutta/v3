// src/components/sections/project/sections/TechStackSection.tsx
"use client";

import { displayFont } from "@/lib/fonts";
import { motion } from "framer-motion";
import { ProjectPageSection } from "@/components/sections/project/ProjectPageSection";
import { SkillTag } from "@/components/ui/Tag";

interface TechStackSectionProps {
    id?: string;
    techStack: Record<string, string[]>;
}

export default function TechStackSection({
    id,
    techStack,
}: TechStackSectionProps) {
    const categories = Object.entries(techStack);

    return (
        <ProjectPageSection
            id={id}
            title={["TECHSTACK", "T3chs✝aCk", "TeCH$t4cK"]}
        >
            <div className="w-full h-[75vh] max-w-5xl mx-auto p-6 flex items-center justify-center">
                <div className="columns-1 md:columns-2 gap-8">
                    {categories.map(
                        ([category, technologies], categoryIndex) => (
                            <motion.div
                                key={categoryIndex}
                                className="relative my-8 px-4 py-8 break-inside-avoid-column border border-current"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 25px 25px, var(--color-text) 0.3%, transparent 0.6%)`,
                                    backgroundSize: "50px 50px",
                                    backgroundBlendMode: "soft-light",
                                }}
                            >
                                {/* Category label */}
                                <div
                                    className={`absolute -top-3 left-4 px-3 ${displayFont} text-xl bg-theme lowercase`}
                                >
                                    {category}
                                </div>

                                {/* Decorative circuit nodes */}
                                <div className="absolute top-9 right-2 w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                                <div className="absolute bottom-1.5 right-8 w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>

                                {/* Tech chips */}
                                <div className="flex flex-wrap gap-2.5 mt-2">
                                    {technologies.map((tech, techIndex) => (
                                        <SkillTag
                                            key={techIndex}
                                            skill={tech}
                                        />
                                    ))}
                                </div>

                                {/* Circuit traces */}
                                <div className="absolute bottom-2 right-0 w-8 h-px bg-current opacity-30"></div>
                                <motion.div
                                    className="absolute bottom-2 h-px bg-current"
                                    style={{
                                        width: "6px",
                                        right: "10px", // Start position close to right-2
                                        boxShadow: "0 0 3px 1px currentColor",
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        right: ["2px", "10px"],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: categoryIndex * 0.3,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        ease: "linear",
                                        times: [0, 0.5, 1],
                                    }}
                                />

                                <div className="absolute bottom-0 right-6 w-px h-2 bg-current opacity-30"></div>
                                <motion.div
                                    className="absolute right-6 w-px bg-current"
                                    style={{
                                        height: "4px",
                                        bottom: "0px", // Start at bottom
                                        boxShadow: "0 0 3px 1px currentColor",
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: [0, 0.8, 0],
                                        bottom: ["0px", "8px", "0px"],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: 1 + categoryIndex * 0.3,
                                        repeat: Infinity,
                                        repeatDelay: 4,
                                        ease: "linear",
                                        times: [0, 0.5, 1],
                                    }}
                                />

                                <div className="absolute top-0 right-2.5 w-px h-9 bg-current opacity-30"></div>
                            </motion.div>
                        )
                    )}
                </div>
            </div>
        </ProjectPageSection>
    );
}
