"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorSet } from "@/types/project";

interface ColorSectionProps {
    id?: string;
    colors: ColorSet[];
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BORDER_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function ColorSection({ id, colors }: ColorSectionProps) {
    const [activeSetIdx, setActiveSetIdx] = useState<number | null>(null);
    const activeSet = activeSetIdx !== null ? colors[activeSetIdx] : null;

    const swingIn = { duration: 0.6, ease: EASE };

    // Overlapping radial blobs on a linear base
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

    // Render palette groups with animated border overlay — shared by desktop and mobile
    const renderGroups = (keyPrefix: string) =>
        colors.flatMap((colorSet, setIdx) => {
            const isActive = activeSetIdx === setIdx;
            const n = colorSet.palette.length;

            const group = (
                <motion.div
                    key={`${keyPrefix}-group-${setIdx}`}
                    className="relative flex flex-row min-h-0 cursor-crosshair"
                    animate={{
                        // Group flex = per-strip factor × number of strips → same visual proportions as before
                        flex: isActive ? 1.5 * n : activeSetIdx === null ? n : 0.6 * n,
                    }}
                    transition={swingIn}
                    onMouseEnter={keyPrefix === "d" ? () => setActiveSetIdx(setIdx) : undefined}
                    onClick={() => setActiveSetIdx(activeSetIdx === setIdx ? null : setIdx)}
                >
                    {colorSet.palette.map((hex, colorIdx) => (
                        <div
                            key={colorIdx}
                            className="group relative flex-1 flex items-end justify-center pb-8 lg:pb-12 overflow-hidden"
                            style={{ backgroundColor: hex }}
                        >
                            <a
                                className={`font-mono ${keyPrefix === "d" ? "text-5xl" : "text-base"} tracking-[0.15em] mix-blend-difference text-white no-underline! hover:underline duration-500 whitespace-nowrap select-none`}
                                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                href={`https://google.com/search?q=%23${hex.slice(1)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                            >
                                {hex.toUpperCase()}
                            </a>
                        </div>
                    ))}

                    {/* Animated inset border; rendered last so it sits above the strip backgrounds */}
                    <motion.div
                        className="absolute inset-0 pointer-events-none z-10"
                        animate={{
                            boxShadow: isActive
                                ? "inset 0 0 0 15px rgba(255,255,255,0.5)"
                                : "inset 0 0 0 0px rgba(255,255,255,0)",
                        }}
                        transition={{ duration: 0.45, ease: BORDER_EASE }}
                    />
                </motion.div>
            );

            return [group];
        });

    const renderPanel = (panelHeight: string, keyPrefix: string, pClass: string) => (
        <motion.div
            className="relative w-full shrink-0 overflow-hidden"
            animate={{ height: activeSet ? panelHeight : 0 }}
            transition={swingIn}
        >
            <AnimatePresence mode="popLayout">
                {activeSet && (
                    <motion.div
                        key={`${keyPrefix}-panel-${activeSetIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                        style={{ background: getGradient(activeSet) }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                            className={`absolute bottom-0 ${pClass} text-white`}
                        >
                            <p className="font-mono text-xs uppercase tracking-[0.3em] mb-3 opacity-60">
                                [ Palette {String((activeSetIdx ?? 0) + 1).padStart(2, "0")} ]
                            </p>
                            <p className="text-sm lg:text-base leading-relaxed max-w-2xl opacity-90">
                                {activeSet.description}
                            </p>
                        </motion.div>

                        {/* White line at the panel bottom — visually ties it to the selected strips */}
                        <motion.div
                            className="absolute bottom-0 inset-x-0 h-px bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.45 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <section
            id={id}
            className="relative snap-center shrink-0 w-screen h-full overflow-hidden bg-background"
        >
            {/* ── DESKTOP ──────────────────────────────────── */}
            <div
                className="hidden md:flex flex-col h-full"
                onMouseLeave={() => setActiveSetIdx(null)}
            >
                {renderPanel("55%", "d", "p-8 lg:p-12")}
                <div className="flex flex-row flex-1 min-h-0">
                    {renderGroups("d")}
                </div>
            </div>

            {/* ── MOBILE ──────────────────────────────────── */}
            <div className="flex md:hidden flex-col h-full">
                {renderPanel("48%", "m", "p-6")}
                <div className="flex flex-row flex-1 min-h-0">
                    {renderGroups("m")}
                </div>
            </div>
        </section>
    );
}
