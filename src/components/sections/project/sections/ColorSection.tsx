"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ColorSet } from "@/types/project";

interface ColorSectionProps {
    id?: string;
    colors: ColorSet[];
}

export default function ColorSection({ id, colors }: ColorSectionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Flatten the colors but KEEP the parent description attached to each hex code
    const flattenedColors = colors.flatMap((colorSet, setIndex) =>
        colorSet.palette.map((hex) => ({
            hex,
            description: colorSet.description,
            setName: `Palette 0${setIndex + 1}`
        }))
    );

    return (
        <section
            id={id}
            className="relative snap-center shrink-0 w-screen h-[calc(100vh-100px)] flex flex-col md:flex-row overflow-hidden bg-background"
        >
            {flattenedColors.map((item, index) => (
                <motion.div
                    key={index}
                    className="group relative flex flex-col justify-end md:justify-between p-6 md:p-12 cursor-crosshair overflow-hidden"
                    style={{ backgroundColor: item.hex }}
                    animate={{
                        flex: activeIndex === index ? 4 : activeIndex === null ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                    {/* Top Label */}
                    <div className="hidden md:flex flex-col mix-blend-difference text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-mono text-sm tracking-widest whitespace-nowrap">
                        <span>[ 0{index + 1} ]</span>
                        <span className="mt-2 text-xs opacity-50 uppercase">{item.setName}</span>
                    </div>

                    {/* Bottom Content Area */}
                    <div className="relative flex flex-col justify-end w-full mix-blend-difference text-white">

                        {/* THE EXPLANATION: Fades in and slides up ONLY when the slice is expanded */}
                        <div
                            className={`absolute bottom-full mb-6 md:mb-10 max-w-sm lg:max-w-xl transition-all duration-700 ease-out text-xs md:text-sm leading-relaxed ${activeIndex === index
                                ? "opacity-80 translate-y-0"
                                : "opacity-0 translate-y-6 pointer-events-none"
                                }`}
                        >
                            <p>{item.description}</p>
                        </div>

                        {/* Hex Code & Labels */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between w-full">
                            <div className="flex flex-col whitespace-nowrap">
                                <span className="text-xs font-mono uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    HEX VALUE
                                </span>
                                <h3 className="text-5xl md:text-6xl lg:text-8xl font-bold uppercase tracking-tighter leading-none origin-bottom-left transition-transform duration-500 md:group-hover:scale-105">
                                    {item.hex}
                                </h3>
                            </div>

                            <div className="hidden lg:flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 font-mono text-xs tracking-widest text-right">
                                <span>COLORSPACE // HEX</span>
                                <span className="opacity-50 mt-1">RAW RENDER</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </section>
    );
}
