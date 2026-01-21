// src/components/ui/Marquee.tsx
"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

interface MarqueeProps {
    children: ReactNode;
    direction?: "left" | "right";
    speed?: number;
    className?: string;
    pauseOnHover?: boolean;
    vertical?: boolean;
}

export default function Marquee({
    children,
    direction = "left",
    speed = 60,
    className = "",
    pauseOnHover = false,
    vertical = false,
}: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [copies, setCopies] = useState(4); // Default, will be recalculated
    const [initialized, setInitialized] = useState(false);
    const [duration, setDuration] = useState(40);

    // Calculate the optimal number of copies based on content width
    useEffect(() => {
        if (!containerRef.current || !contentRef.current) return;

        const observer = new ResizeObserver(() => {
            if (!containerRef.current || !contentRef.current) return;

            const containerSize = vertical
                ? containerRef.current.clientHeight
                : containerRef.current.clientWidth;

            const contentSize = vertical
                ? contentRef.current.clientHeight
                : contentRef.current.clientWidth;

            // Calculate how many copies we need to fill the container at least twice
            // (for seamless looping) plus one more for safety
            const neededCopies = Math.max(
                4,
                Math.ceil((containerSize * 2) / contentSize)
            );

            // Calculate duration based on content size and desired speed
            // Lower duration = faster animation
            const calculatedDuration = contentSize / speed;

            setCopies(neededCopies);
            setDuration(calculatedDuration);
            setInitialized(true);
        });

        observer.observe(containerRef.current);
        observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [speed, vertical]);

    // Direction is applied through transform direction
    const isReverse = direction === "right";

    return (
        <motion.div
            ref={containerRef}
            className={twMerge(
                "group flex overflow-hidden",
                vertical ? "flex-col" : "flex-row",
                !initialized && "opacity-0", // Hide until measurements are done
                initialized && "opacity-100 transition-opacity duration-500",
                className
            )}
            style={
                {
                    // CSS custom properties for animation
                    "--duration": `${duration}s`,
                    "--gap": "0rem",
                } as React.CSSProperties
            }
        >
            {/* First element to measure content size */}
            <motion.div
                ref={contentRef}
                className={twMerge(
                    "flex shrink-0 justify-around gap-[var(--gap)]",
                    vertical ? "flex-col" : "flex-row",
                    !vertical && "animate-marquee",
                    vertical && "animate-marquee-vertical",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
                style={{
                    animation: `${
                        vertical ? "marquee-vertical" : "marquee"
                    } var(--duration) linear infinite ${
                        isReverse ? "reverse" : ""
                    }`,
                }}
            >
                {children}
            </motion.div>

            {/* Additional copies for seamless looping */}
            {Array(copies - 1)
                .fill(0)
                .map((_, i) => (
                    <motion.div
                        key={i}
                        className={twMerge(
                            "flex shrink-0 justify-around gap-[var(--gap)]",
                            vertical ? "flex-col" : "flex-row",
                            !vertical && "animate-marquee",
                            vertical && "animate-marquee-vertical",
                            pauseOnHover &&
                                "group-hover:[animation-play-state:paused]"
                        )}
                        style={{
                            animation: `${
                                vertical ? "marquee-vertical" : "marquee"
                            } var(--duration) linear infinite ${
                                isReverse ? "reverse" : ""
                            }`,
                        }}
                    >
                        {children}
                    </motion.div>
                ))}
        </motion.div>
    );
}
