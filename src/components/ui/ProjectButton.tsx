// src/components/ui/ProjectButton.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { ProjectLink } from "@/types/project";

interface ProjectButtonProps {
    link: ProjectLink;
    index: number;
}

export default function ProjectButton({ link, index }: ProjectButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center px-2 py-1 uppercase group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            style={{
                textDecoration: "none",
                color: isHovered ? "white" : "inherit",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsHovered(true)}
            onBlur={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
        >
            {/* Background dot/pill */}
            <motion.div
                className="absolute left-0 top-1/2 rounded-full bg-[var(--color-accent)] z-0"
                style={{
                    transformOrigin: "left center",
                }}
                animate={{
                    width: isHovered ? "100%" : "32px",
                    height: isHovered ? "100%" : "32px",
                    y: "-50%",
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Centered content container */}
            <div className="flex items-center justify-center gap-2 z-10 relative">
                {/* Arrow icon */}
                <HiArrowUpRight
                    className={isHovered ? "opacity-100" : "opacity-0"}
                    aria-hidden="true"
                />

                {/* Button text */}
                <span>{link.name.toUpperCase()}</span>
            </div>
        </motion.a>
    );
}
