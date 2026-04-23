"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { Project } from "@/types/project";
import { RandomIconsLoader } from "@/components/ui/RandomIcons";
import { serifFont } from "@/lib/fonts";

interface NameSectionProps {
    project: Project;
}

export default function NameSection({ project }: NameSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // The crucial state: Detects actual hardware mice, not just screen width!
    const [hasMouse, setHasMouse] = useState(false);

    // Mouse Tracking Physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100, mass: 0.5 });
    const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100, mass: 0.5 });

    useEffect(() => {
        setIsMounted(true);

        // Listen for a fine pointer (mouse/trackpad)
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setHasMouse(mediaQuery.matches);

        const handleMediaChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
        mediaQuery.addEventListener("change", handleMediaChange);

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mouseX.set(rect.width / 2);
            mouseY.set(rect.height / 2);
        }

        return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, [mouseX, mouseY]);

    const handlePointerMove = (e: React.PointerEvent) => {
        // Now it relies on the state instead of window.matchMedia on every move
        if (!containerRef.current || !hasMouse) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const noiseBackground = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
    const clipPath = useMotionTemplate`circle(clamp(150px, 35vw, 350px) at ${smoothX}px ${smoothY}px)`;

    return (
        <section
            ref={containerRef}
            onPointerMove={handlePointerMove}
            className={`relative w-screen h-fit min-h-full overflow-hidden bg-background text-foreground shrink-0 flex flex-col ${hasMouse ? "cursor-crosshair" : ""}`}
        >
            {/* --- LAYER 1: THE BASE LAYER --- */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "4vw 4vw"
                }}
            />

            {/* Responsive layout: desktop = column, mobile = row with label right, meta left */}
            {hasMouse ? (
                <div className="inset-0 flex flex-col justify-between z-0 flex-1 absolute p-12 pb-8">
                    <div className="flex-1 flex flex-col items-end justify-start w-full h-fit! my-0">
                        <h1 className={`leading-[1.1] h-fit! max-h-[calc(100%-400px)] max-w-[90vw] text-[clamp(4rem,20vw,7rem)] tracking-tighter [writing-mode:horizontal-tb] text-center text-transparent ${serifFont} [-webkit-text-stroke:2px_currentColor]`}>
                            {project.label}
                        </h1>
                    </div>
                    {/* Metadata Grid */}
                    <div className="grid text-xs font-mono uppercase tracking-widest relative z-50 pb-10 grid-cols-3 gap-8 opacity-60">
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">Type</span>
                            <span className="leading-relaxed uppercase text-xs">{project.type}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <span className="opacity-50">Timestamp</span>
                            <span className="text-xs">{project.date.toDateString()}</span>
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
                </div>
            ) : (
                <div className="relative flex flex-row justify-between items-stretch w-full h-full pl-6 pr-8 pt-6 pb-24 gap-2">
                    {/* Left: Icons + Meta */}
                    <div className="flex flex-col justify-between items-start flex-1 min-w-0 max-w-[50vw]">
                        <div className="flex flex-col items-start gap-6 px-2 py-2 md:py-4 
                        justify-between max-h-[calc(100vh-200px)]">
                            <div className="flex flex-col items-center gap-4">
                                {/* Make all random icons large by wrapping in a container with text size */}
                                <div className="flex flex-col items-center gap-4 text-6xl md:text-7xl lg:text-8xl">
                                    <RandomIconsLoader count={3} />
                                </div>
                                <project.icon className="text-6xl md:text-7xl lg:text-8xl" />
                            </div>
                        </div>
                        <div className="mt-8 grid text-xs font-mono uppercase tracking-widest z-50 grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="opacity-50">Type</span>
                                <span className="leading-relaxed uppercase text-sm">{project.type}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="opacity-50">Timestamp</span>
                                <span className="text-sm">{project.date.toDateString()}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="opacity-50">Links</span>
                                <div className="flex gap-4 flex-wrap">
                                    {project.links?.map((link: any, i: number) => (
                                        <Link key={i} href={link.url} target="_blank" className="underline underline-offset-4 hover:text-accent transition-colors">{link.platform}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Right: Vertical Label */}
                    <div className="flex flex-col justify-center items-end min-h-0 max-h-full">
                        <h1 className={`leading-[1.1] h-fit! max-h-[calc(100vh-200px)] max-w-[40vw] text-[clamp(3.5rem,24vw,5rem)] [writing-mode:vertical-rl] text-foreground ${serifFont} italic text-left`}>
                            {project.label}
                        </h1>
                    </div>
                </div>
            )}

            {/* --- LAYER 2: THE X-RAY LENS (DESKTOP ONLY) --- */}
            {/* The Lens only renders if `hasMouse` is true, keeping touchscreens safe */}
            {isMounted && hasMouse && (
                <motion.div
                    className="absolute inset-0 z-10 bg-foreground text-background flex-col justify-between p-12 pb-8 flex pointer-events-none"
                    style={{ clipPath }}
                >
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: noiseBackground }} />
                    <div className="flex-1 flex flex-row items-center justify-center w-full relative z-10">
                        <div className={`inline-flex text-[clamp(3.5rem,20vw,10rem)] leading-[1.1] ${serifFont} italic text-center max-w-[95vw] break-words hyphens-auto`}>
                            <span className="overflow-hidden block py-[0.05em]">
                                {project.label}<project.icon className="ml-4 mb-8 inline-block align-middle text-[0.8em]" />
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-8 text-xs font-sans font-bold uppercase tracking-widest relative z-10 pb-10">
                        <div className="flex flex-col gap-2">
                            <span className="opacity-50">Type</span>
                            <span className="leading-relaxed uppercase">{project.type}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <span className="opacity-50">Timestamp</span>
                            <span>{project.date.toDateString()}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <span className="opacity-50">Links</span>
                            <div className="flex gap-4">
                                {project.links?.map((link: any, i: number) => (
                                    <Link key={i} href={link.url} target="_blank" className="underline underline-offset-4 pointer-events-none">{link.platform}</Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Desktop physical cursor dot */}
            {isMounted && hasMouse && (
                <motion.div
                    className="absolute w-2 h-2 rounded-full bg-accent z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{ left: smoothX, top: smoothY }}
                />
            )}
        </section>
    );
}
