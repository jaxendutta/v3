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
    const [copies, setCopies] = useState(4);
    const [initialized, setInitialized] = useState(false);
    const [duration, setDuration] = useState(40);

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

            if (contentSize === 0) return;

            const neededCopies = Math.max(
                4,
                Math.ceil((containerSize * 2) / contentSize)
            );

            const calculatedDuration = contentSize / speed;

            setCopies(neededCopies);
            setDuration(calculatedDuration);
            setInitialized(true);
        });

        observer.observe(containerRef.current);
        observer.observe(contentRef.current);

        return () => observer.disconnect();
    }, [speed, vertical]);

    const isReverse = direction === "right";

    return (
        <>
            {/* Inject Animation Keyframes Locally */}
            <style jsx global>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee-vertical {
                    0% { transform: translateY(0%); }
                    100% { transform: translateY(-100%); }
                }
                .animate-marquee {
                    animation: marquee var(--duration) linear infinite;
                }
                .animate-marquee-vertical {
                    animation: marquee-vertical var(--duration) linear infinite;
                }
            `}</style>

            <motion.div
                ref={containerRef}
                className={twMerge(
                    "group flex overflow-hidden z-0", // Added z-0 to keep behind text if needed
                    vertical ? "flex-col h-full" : "flex-row w-full",
                    !initialized && "opacity-0",
                    initialized && "opacity-100 transition-opacity duration-500",
                    className
                )}
                style={{
                    "--duration": `${duration}s`,
                    "--gap": "1rem", // Added a default gap
                } as React.CSSProperties}
            >
                <motion.div
                    ref={contentRef}
                    className={twMerge(
                        "flex shrink-0 justify-around gap-[var(--gap)] items-center",
                        vertical ? "flex-col" : "flex-row",
                        !vertical && "animate-marquee",
                        vertical && "animate-marquee-vertical",
                        pauseOnHover && "group-hover:[animation-play-state:paused]"
                    )}
                    style={{
                        animationDirection: isReverse ? "reverse" : "normal",
                    }}
                >
                    {children}
                </motion.div>

                {Array(copies - 1)
                    .fill(0)
                    .map((_, i) => (
                        <motion.div
                            key={i}
                            className={twMerge(
                                "flex shrink-0 justify-around gap-[var(--gap)] items-center",
                                vertical ? "flex-col" : "flex-row",
                                !vertical && "animate-marquee",
                                vertical && "animate-marquee-vertical",
                                pauseOnHover && "group-hover:[animation-play-state:paused]"
                            )}
                            style={{
                                animationDirection: isReverse ? "reverse" : "normal",
                            }}
                        >
                            {children}
                        </motion.div>
                    ))}
            </motion.div>
        </>
    );
}
