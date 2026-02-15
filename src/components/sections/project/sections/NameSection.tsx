"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { Project } from "@/types/project";
import StyledLink from "@/components/ui/StyledLink";
import { codeFont, headingFont } from "@/lib/fonts";
import RandomIcons, { getRandomIcons } from "@/components/ui/RandomIcons";

interface NameSectionProps {
    project: Project;
}

export default function NameSection({ project }: NameSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Mouse Tracking Physics (Only used on Desktop)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

    useEffect(() => {
        setIsMounted(true);
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(rect.width / 2);
            mouseY.set(rect.height / 2);
        }
    }, [mouseX, mouseY]);

    // Only tracks pointer if the device actually has a fine pointer (mouse)
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!containerRef.current || window.matchMedia("(pointer: coarse)").matches) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const noiseBackground = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

    const type = project.type || "Development";

    // The X-Ray clip path
    const clipPath = useMotionTemplate`circle(clamp(150px, 28vw, 350px) at ${smoothX}px ${smoothY}px)`;

    return (
        <section
            ref={containerRef}
            onPointerMove={handlePointerMove}
            // Let the user scroll naturally
            className="relative w-screen h-fit min-h-full overflow-hidden bg-background text-foreground md:cursor-crosshair shrink-0 flex flex-col"
        >
            {/* --- LAYER 1: THE BASE LAYER (MOBILE: Solid & Legible | DESKTOP: Hollow Blueprint) --- */}
            
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "4vw 4vw"
                }}
            />

            <div className="relative md:absolute inset-0 flex flex-col justify-between p-6 md:p-12 pb-12 md:pb-8 z-0 flex-1">
                <div className="flex-1 flex flex-col items-end justify-start w-full h-fit! my-4 md:my-0">
                    {/* THE TITLE: 
                        Mobile: Solid, heavily-weighted Sans-Serif for perfect reading.
                        Desktop: Transparent, outlined Mono-space for the blueprint vibe. 
                    */}
                    
                    <h1 className={`text-[clamp(3.5rem,24vw,5rem)] md:text-[clamp(4rem,20vw,7rem)] leading-[0.85] md:tracking-tighter md:break-words hyphens-auto 
                        [writing-mode:vertical-rl] h-fit! max-h-[calc(100%-400px)] max-w-[95vw] md:[writing-mode:horizontal-tb]
                        text-foreground font-bold uppercase text-left md:text-center
                        md:text-transparent md:font-mono md:[-webkit-text-stroke:2px_currentColor]`}
                    >
                        {/* Mobile: 3 random icons vertically in top left */}
                        <div className="absolute top-2 left-2 flex flex-row gap-2 px-6 py-4">
                            {/* Not rotated, vertical stack */}
                            <RandomIcons count={3} />
                        </div>
                        {project.name}
                    </h1>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-xs font-mono uppercase tracking-widest md:opacity-60 relative z-50 pb-10">
                    <div className="flex flex-col gap-2">
                        <span className="opacity-50">Type</span>
                        <span className="leading-relaxed uppercase text-sm md:text-xs">{type}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 md:items-center">
                        <span className="opacity-50">Timestamp</span>
                        <span className="text-sm md:text-xs">{project.date.toDateString()}</span>
                    </div>
                    
                    {/* Mobile Links (Visible and clickable on mobile directly on the base layer) */}
                    <div className="flex flex-col gap-2 md:hidden">
                        <span className="opacity-50">Links</span>
                        <div className="flex flex-wrap gap-4">
                            {project.links?.map((link: any, i: number) => (
                                <Link key={i} href={link.url} target="_blank" className="underline underline-offset-4 hover:text-accent transition-colors">{link.platform}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Static Links (Unclickable visual anchor for the blueprint) */}
                    <div className="hidden md:flex flex-col gap-2 items-end">
                        <span className="opacity-50">Links</span>
                        <div className="flex gap-4">
                            {project.links?.map((link: any, i: number) => (
                                <Link key={i} href={link.url} target="_blank" className="underline underline-offset-4 hover:text-accent transition-colors">{link.platform}</Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- LAYER 2: THE X-RAY LENS (DESKTOP ONLY) --- */}
            
            {/* hidden md:flex completely disables this entire mechanic on mobile devices */}
            {isMounted && (
                <motion.div
                    className="hidden md:flex absolute inset-0 z-10 bg-foreground text-background flex-col justify-between p-12 pb-8"
                    style={{ clipPath }}
                >
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: noiseBackground }} />
                    <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
                        {/* The solid, aggressive Sans font inside the X-Ray */}
                        <h1 className={`text-[clamp(3.5rem,18vw,20rem)] leading-[0.85] font-sans uppercase font-bold text-center max-w-[95vw] break-words hyphens-auto
                            `}>
                            {project.name}
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-8 text-xs font-sans font-bold uppercase tracking-widest relative z-10 pb-10">
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">Type</span>
                            <span className="leading-relaxed uppercase">{type}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <span className="opacity-50">Timestamp</span>
                            <span>{project.date.toDateString()}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <span className="opacity-50">Links</span>
                            <div className="flex gap-4">
                                {project.links?.map((link: any, i: number) => (
                                    <Link key={i} href={link.url} target="_blank" className="underline underline-offset-4 hover:text-accent transition-colors">{link.platform}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}            

            {/* Desktop physical cursor dot */}
            {isMounted && (
                <motion.div
                    className="hidden md:block absolute w-2 h-2 rounded-full bg-accent z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{ left: smoothX, top: smoothY }}
                />
            )}
        </section>
    );
}
