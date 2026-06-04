"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorSet } from "@/types/project";

interface ColorSectionProps {
    id?: string;
    colors: ColorSet[];
}

export default function ColorSection({ id, colors }: ColorSectionProps) {
    const [activeSetIdx, setActiveSetIdx] = useState<number | null>(null);
    const activeSet = activeSetIdx !== null ? colors[activeSetIdx] : null;

    const swingIn = { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

    // Overlapping radial blobs layered on a linear base — the "cool colour mix"
    const getGradient = (set: ColorSet): string => {
        if (set.palette.length === 1) return set.palette[0];
        const n = set.palette.length;
        const blobs = set.palette.map((c, i) => {
            const x = Math.round((i / Math.max(n - 1, 1)) * 80 + 10);
            const y = i % 2 === 0 ? 30 : 70;
            return `radial-gradient(ellipse 80% 80% at ${x}% ${y}%, ${c} 0%, transparent 65%)`;
        });
        const base = `linear-gradient(135deg, ${set.palette[0]}, ${set.palette[n - 1]})`;
        return [...blobs, base].join(", ");
    };

    return (
        <section
            id={id}
            className="relative snap-center shrink-0 w-screen h-full overflow-hidden bg-background"
        >
            {/* DESKTOP VERSION */}
            <div className="hidden md:flex flex-col h-full" onMouseLeave={() => setActiveSetIdx(null)}>

                {/* Info panel: animates down from top on palette hover */}
                <motion.div
                    className="relative w-full shrink-0 overflow-hidden"
                    animate={{ height: activeSet ? "55%" : 0 }}
                    transition={swingIn}
                >
                    <AnimatePresence mode="popLayout">
                        {activeSet && (
                            <motion.div
                                key={activeSetIdx}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                                style={{ background: getGradient(activeSet) }}
                            >
                                {/* Bottom-fade for text legibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35, delay: 0.15 }}
                                    className="absolute bottom-0 p-8 lg:p-12 text-white"
                                >
                                    <p className="font-mono text-xs uppercase tracking-[0.3em] mb-3 opacity-60">
                                        [ Palette {String((activeSetIdx ?? 0) + 1).padStart(2, "0")} ]
                                    </p>
                                    <p className="text-sm lg:text-base leading-relaxed max-w-2xl opacity-90">
                                        {activeSet.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Color strips: palette groups separated by a thin rule */}
                <div className="flex flex-row flex-1 min-h-0">
                    {colors.flatMap((colorSet, setIdx) => {
                        const isActive = activeSetIdx === setIdx;
                        const strips = colorSet.palette.map((hex, colorIdx) => (
                            <motion.div
                                key={`${setIdx}-${colorIdx}`}
                                className="group relative flex items-end justify-center pb-8 lg:pb-12 overflow-hidden"
                                style={{ backgroundColor: hex }}
                                animate={{
                                    flex: isActive ? 1.5 : activeSetIdx === null ? 1 : 0.6,
                                }}
                                transition={swingIn}
                                onMouseEnter={() => setActiveSetIdx(setIdx)}
                                onClick={() =>
                                    setActiveSetIdx(activeSetIdx === setIdx ? null : setIdx)
                                }
                            >
                                <a
                                    className="font-mono text-5xl tracking-[0.15em] mix-blend-difference text-white no-underline! hover:underline duration-500 whitespace-nowrap select-none"
                                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                    href={`https://google.com/search?q=%23${hex.slice(1)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {hex.toUpperCase()}
                                </a>
                            </motion.div>
                        ));

                        if (setIdx < colors.length - 1) {
                            strips.push(
                                <div
                                    key={`sep-${setIdx}`}
                                    className="w-px bg-background/40 self-stretch shrink-0"
                                />
                            );
                        }
                        return strips;
                    })}
                </div>
            </div>

            {/* MOBILE VERSION */}
            <div className="flex md:hidden flex-col h-full">

                {/* Same gradient info panel as desktop */}
                <motion.div
                    className="relative w-full shrink-0 overflow-hidden"
                    animate={{ height: activeSet ? "48%" : 0 }}
                    transition={swingIn}
                >
                    <AnimatePresence mode="popLayout">
                        {activeSet && (
                            <motion.div
                                key={`m-panel-${activeSetIdx}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                                style={{ background: getGradient(activeSet) }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35, delay: 0.15 }}
                                    className="absolute bottom-0 p-6 text-white"
                                >
                                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] mb-2 opacity-60">
                                        [ Palette {String((activeSetIdx ?? 0) + 1).padStart(2, "0")} ]
                                    </p>
                                    <p className="text-xs leading-relaxed opacity-90">
                                        {activeSet.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Same vertical-strip layout as desktop */}
                <div className="flex flex-row flex-1 min-h-0">
                    {colors.flatMap((colorSet, setIdx) => {
                        const isActive = activeSetIdx === setIdx;
                        const strips = colorSet.palette.map((hex, colorIdx) => (
                            <motion.div
                                key={`m-${setIdx}-${colorIdx}`}
                                className="group relative flex items-end justify-center pb-6 cursor-crosshair overflow-hidden"
                                style={{ backgroundColor: hex }}
                                animate={{
                                    flex: isActive ? 1.5 : activeSetIdx === null ? 1 : 0.6,
                                }}
                                transition={swingIn}
                                onClick={() =>
                                    setActiveSetIdx(activeSetIdx === setIdx ? null : setIdx)
                                }
                            >
                                <a
                                    href={`https://google.com/search?q=%23${hex.slice(1)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono tracking-[0.15em] no-underline! mix-blend-difference text-white duration-300 whitespace-nowrap select-none"
                                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                >
                                    {hex.toUpperCase()}
                                </a>
                            </motion.div>
                        ));
                        if (setIdx < colors.length - 1) {
                            strips.push(
                                <div key={`m-sep-${setIdx}`} className="w-px bg-background/40 self-stretch shrink-0" />
                            );
                        }
                        return strips;
                    })}
                </div>
            </div>
        </section>
    );
}
