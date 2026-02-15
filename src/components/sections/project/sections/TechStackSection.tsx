"use client";

import { Tech } from "@/types/project";
import { motion } from "framer-motion";

interface TechStackSectionProps {
    id?: string;
    techStack: Record<string, Tech[]>;
}

export default function TechStackSection({ id, techStack }: TechStackSectionProps) {
    return (
        <section
            id={id}
            className="relative snap-start shrink-0 w-screen min-h-[calc(100vh-120px)] flex flex-col justify-center gap-8 md:gap-12 px-6 md:px-12 py-12 md:py-24 bg-background text-foreground overflow-hidden"
        >
            {Object.entries(techStack).map(([category, techs], index) => (
                <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row items-start md:items-baseline border-t border-border/40 pt-10 first:border-t-0 md:first:border-t"
                >
                    {/* The Category (Small, Technical, Monospaced) */}
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                            [ {category} ]
                        </h3>
                    </div>

                    {/* The Technologies (Massive, Bold, Interactive) */}
                    {/* 'group/list' triggers the focus effect on the children */}
                    <div className="w-full md:w-2/3 flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 group/list">
                        {techs.map((tech) => (
                            <div
                                key={tech.name}
                                className="relative flex items-start cursor-crosshair group/tech opacity-100 md:group-hover/list:opacity-20 hover:!opacity-100 transition-opacity duration-500"
                            >
                                <span className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase tracking-tighter leading-none text-foreground transition-transform duration-500 md:group-hover/tech:-translate-y-2">
                                    {tech.name}
                                </span>

                                {/* The Version Number (Tiny Superscript) */}
                                {tech.version && (
                                    <span className="ml-2 mt-0.5 text-xs md:text-sm font-mono text-muted-foreground transition-all duration-500 opacity-50 md:group-hover/tech:opacity-100 md:group-hover/tech:-translate-y-2">
                                        v{tech.version}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            ))}
        </section>
    );
}
