"use client";

import { motion } from "framer-motion";
import { displayFont } from "@/lib/fonts";
import { ReactNode, useState, useEffect } from "react";

export type Orientation = "landscape" | "portrait";

interface ProjectPageSectionProps {
    id?: string;
    title: string[];
    children?: ReactNode;
    className?: string;
}

export const ProjectPageSection = ({
    id,
    title,
    children,
    className = "",
}: ProjectPageSectionProps) => {
    const [orientation, setOrientation] = useState<Orientation>("landscape");

    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation(
                window.innerWidth > window.innerHeight
                    ? "landscape"
                    : "portrait"
            );
        };

        // Set initial orientation
        handleOrientationChange();

        // Add event listener for resize
        window.addEventListener("resize", handleOrientationChange);

        // Clean up
        return () =>
            window.removeEventListener("resize", handleOrientationChange);
    }, []);

    const sectionStyles: React.CSSProperties = {
        alignItems: "center",
        display: "flex",
        gap: "4rem",
        justifyContent: "flex-start",
        ...(orientation === "landscape"
            ? {
                  flexDirection: "row",
                  padding: "4rem",
              }
            : {
                  flexDirection: "column",
                  padding: "4rem 2rem 8rem",
              }),
    };

    return (
        <motion.section
            id={id}
            className={`snap-start ${className}`}
            style={sectionStyles}
        >
            {title.length > 0 && (
                <motion.div
                    className={`${displayFont} text-5xl whitespace-pre-line`}
                    style={{
                        fontStyle: "italic",
                        transform:
                            orientation === "landscape"
                                ? "rotate(-90deg)"
                                : "none",
                    }}
                >
                    {title.join("\n")}
                </motion.div>
            )}
            {children}
        </motion.section>
    );
};
