"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import RotatingButton from "@/components/ui/RotatingButton";
import { GiParanoia } from "react-icons/gi";

export default function NotFound() {
    const [hasMouse, setHasMouse] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Physics Engine for the Mouse Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 1 });
    const smoothY = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 1 });

    useEffect(() => {
        setIsMounted(true);
        const mediaQuery = window.matchMedia("(pointer: fine)");
        setHasMouse(mediaQuery.matches);
        const handleMediaChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
        mediaQuery.addEventListener("change", handleMediaChange);
        return () => mediaQuery.removeEventListener("change", handleMediaChange);
    }, []);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!hasMouse) return;
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(x);
        mouseY.set(y);
    };

    // Parallax Mapping
    const x1 = useTransform(smoothX, [-1, 1], [-80, 80]);
    const y1 = useTransform(smoothY, [-1, 1], [-40, 40]);

    const x2 = useTransform(smoothX, [-1, 1], [40, -40]);
    const y2 = useTransform(smoothY, [-1, 1], [40, -40]);

    const x3 = useTransform(smoothX, [-1, 1], [-60, 60]);
    const y3 = useTransform(smoothY, [-1, 1], [50, -50]);

    const noiseBackground = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

    return (
        <main
            onPointerMove={handlePointerMove}
            className="relative w-screen h-screen overflow-hidden bg-background text-foreground flex flex-col items-center justify-center cursor-crosshair"
        >
            {/* --- LAYER 1: ARCHITECTURAL BASE --- */}
            <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "4vw 4vw"
                }}
            />
            <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: noiseBackground }} />

            {/* --- LAYER 2: THE TYPOGRAPHIC COLLIDER --- */}
            {isMounted && (
                <div className="relative z-10 flex flex-row items-center justify-center self-startgap-2 md:gap-8 w-full h-full
                    pointer-events-none mix-blend-difference text-[clamp(8rem,25vw,30rem)] mb-60">

                    {/* First '4' - Solid Sans */}
                    <motion.div
                        style={{ x: hasMouse ? x1 : 0, y: hasMouse ? y1 : 0 }}
                        animate={!hasMouse ? { y: ["-10px", "10px", "-10px"] } : {}}
                        transition={!hasMouse ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : {}}
                        className="font-sans font-black leading-none"
                    >
                        4
                    </motion.div>

                    {/* The '0' - Elegant Hollow Serif Italic */}
                    <motion.div
                        style={{ x: hasMouse ? x2 : 0, y: hasMouse ? y2 : 0, WebkitTextStroke: "2px var(--foreground)" }}
                        animate={!hasMouse ? { y: ["15px", "-15px", "15px"] } : {}}
                        transition={!hasMouse ? { repeat: Infinity, duration: 5, ease: "easeInOut" } : {}}
                        className="text-[1.3em] font-serif italic font-light leading-none text-transparent"
                    >
                        0
                    </motion.div>

                    {/* Second '4' - Solid Sans */}
                    <motion.div
                        style={{ x: hasMouse ? x3 : 0, y: hasMouse ? y3 : 0 }}
                        animate={!hasMouse ? { y: ["-12px", "12px", "-12px"] } : {}}
                        transition={!hasMouse ? { repeat: Infinity, duration: 4.5, ease: "easeInOut" } : {}}
                        className="font-sans font-black leading-none"
                    >
                        4
                    </motion.div>
                </div>
            )}

            {/* --- LAYER 3 --- */}
            <div className="absolute inset-0 z-50 flex flex-col justify-between p-6 md:p-12 pointer-events-none">

                {/* Top Status Bar */}
                <div className="flex justify-between items-start w-full uppercase font-mono text-xs tracking-[0.2em] opacity-50">
                    <span>404</span>
                    <span>NOT FOUND</span>
                </div>

                {/* Bottom Interactive Area */}
                <div className="flex flex-col md:flex-row mb-10 justify-between items-center md:items-end w-full gap-8">

                    {/* Minimalist Editorial Message */}
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <h2 className="text-sm md:text-base font-sans font-bold uppercase tracking-widest flex items-center justify-center md:justify-start gap-3">
                            Page Not Found
                        </h2>
                        <p className="text-xs md:text-sm font-sans opacity-60 max-w-[280px] leading-relaxed">
                            The document you are looking for does not exist, has been moved, or is currently unavailable.
                            <br />
                            Let&apos;s get you back to safety.
                        </p>
                    </div>

                    {/* The Clean Escape Mechanism */}
                    <div className="pointer-events-auto">
                        <RotatingButton
                            href="/"
                            texts={["RETURN", "TO", "HOME", "SHELTER", "SAFETY"]}
                            centerIcon={GiParanoia}
                            size={120}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
