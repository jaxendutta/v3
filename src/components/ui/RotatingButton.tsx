// src/components/ui/RotatingButton.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

export interface RotatingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    texts: string[];
    delimiters?: string[];
    size?: number | { default: number; md?: number; lg?: number };
    variant?: "default" | "frost" | "raised" | "glow";
    href?: string;
    onClick?: () => void;
    centerIcon?: IconType;
    className?: string;
    rotationDuration?: number;
    fontSize?: number | { default: number; md?: number; lg?: number };
    disabled?: boolean;
}

const RotatingButton: React.FC<RotatingButtonProps> = ({
    texts,
    delimiters = ["✦"],
    size = { default: 90, md: 110, lg: 140 },
    variant = "default",
    href,
    onClick = () => {},
    centerIcon,
    className = "",
    rotationDuration = 10,
    fontSize = { default: 11, md: 12, lg: 14 },
    type = "button",
    disabled = false,
}) => {
    texts = texts.map((text) => text.toUpperCase());
    const [pathId] = useState(
        `circle-path-${Math.random().toString(36).slice(2, 11)}`
    );
    const [currentSize, setCurrentSize] = useState<number>(
        typeof size === "number" ? size : size.default
    );
    const [currentFontSize, setCurrentFontSize] = useState<number>(
        typeof fontSize === "number" ? fontSize : fontSize.default
    );

    useEffect(() => {
        const handleResize = () => {
            if (typeof size === "number") {
                setCurrentSize(size);
                return;
            }
            if (typeof fontSize === "number") {
                setCurrentFontSize(fontSize);
                return;
            }

            const { innerWidth } = window;
            if (innerWidth >= 1024) {
                if (size.lg) setCurrentSize(size.lg);
                if (fontSize.lg) setCurrentFontSize(fontSize.lg);
            } else if (innerWidth >= 768) {
                if (size.md) setCurrentSize(size.md);
                if (fontSize.md) setCurrentFontSize(fontSize.md);
            } else {
                setCurrentSize(size.default);
                setCurrentFontSize(fontSize.default);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [size, fontSize]);

    // Calculate the radius based on the current size
    const radius = currentSize / 2;
    const innerRadius = radius * 0.65;

    // Rest of the component remains the same, just use currentSize instead of size
    const pathDefinition = `M ${radius}, ${radius} m -${radius * 0.8}, 0 a ${
        radius * 0.8
    },${radius * 0.8} 0 1,1 ${radius * 1.6},0 a ${radius * 0.8},${
        radius * 0.8
    } 0 1,1 -${radius * 1.6},0`;

    // Create text segment with appropriate spacing
    const createTextSegments = () => {
        // Create interleaved segments array
        const segments: string[] = [];
        texts.forEach((text, index) => {
            segments.push(text);
            if (index < texts.length - 1 || true) {
                // Always add delimiter
                segments.push(delimiters[index % delimiters.length]);
            }
        });

        // Calculate total text length to determine spacing
        const circumference = 2 * Math.PI * (radius * 0.7);
        const totalTextLength = segments.reduce(
            (acc, segment) => acc + segment.length,
            0
        );

        // Calculate the empty space available for distribution
        const emptySpace = circumference - totalTextLength * currentFontSize * 0.5; // Approximate char width
        const spaceBetweenSegments = emptySpace / segments.length;

        return segments.map((segment, index) => {
            // Calculate offset based on previous segments and spacing
            let offset = 0;
            for (let i = 0; i < index; i++) {
                offset +=
                    segments[i].length * currentFontSize * 0.5 + spaceBetweenSegments;
            }

            // Convert to percentage of circumference
            const offsetPercentage = (offset / circumference) * 100;

            return (
                <text key={index} fontSize={currentFontSize}>
                    <textPath
                        href={`#${pathId}`}
                        startOffset={`${offsetPercentage}%`}
                    >
                        {segment}
                    </textPath>
                </text>
            );
        });
    };

    // Render icon
    const renderIcon = () => {
        if (!centerIcon) return null;

        if (typeof centerIcon === "function") {
            const IconComponent = centerIcon as IconType;
            return <IconComponent size={innerRadius} />;
        }

        return centerIcon;
    };

    // Apply variant-specific styles
    const getVariantClass = () => {
        switch (variant) {
            case "frost":
                return "bg-opacity-10 backdrop-blur-md shadow-md";
            case "raised":
                return "shadow-md hover:shadow-lg";
            case "glow":
                return "bg-theme shadow-[0_0_15px_15px_var(--color-background)] hover:shadow-[0_0_45px_45px_var(--color-background)]";
            default:
                return "";
        }
    };

    // The main button content
    const buttonContent = (
        <motion.div
            className={`group relative inline-flex items-center justify-center rounded-full ${getVariantClass()}`}
            style={{
                width: currentSize,
                height: currentSize,
            }}
        >
            {/* Rotating SVG with text */}
            <motion.svg
                className="p-1 absolute inset-0 h-full w-full fill-current group-hover:fill-accent"
                viewBox={`0 0 ${currentSize} ${currentSize}`}
                animate={{ rotate: 360 }}
                transition={{
                    duration: rotationDuration,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                <defs>
                    <path id={pathId} d={pathDefinition} />
                </defs>
                {createTextSegments()}
            </motion.svg>

            {/* Center circle with icon */}
            <motion.div
                className="absolute flex items-center justify-center rounded-full"
                style={{
                    width: innerRadius * 2,
                    height: innerRadius * 2,
                    top: radius - innerRadius,
                    left: radius - innerRadius,
                }}
            >
                {renderIcon()}
            </motion.div>
        </motion.div>
    );

    // Render the appropriate element based on props
    return (
        <motion.div
            className={`relative inline-flex items-center justify-center rounded-full ${className}`}
            whileHover={{
                color: "var(--color-accent)",
                fill: "var(--color-accent)",
            }}
        >
            {href ? (
                <Link
                    href={href}
                    onClick={onClick}
                    className="flex items-center justify-center focus:outline-none"
                    aria-label={texts[0] || "Rotating button"}
                >
                    {buttonContent}
                </Link>
            ) : onClick ? (
                <button
                    type={type}
                    onClick={onClick}
                    className="flex items-center justify-center focus:outline-none"
                    aria-label={texts[0] || "Rotating button"}
                    disabled={disabled}
                >
                    {buttonContent}
                </button>
            ) : (
                <div
                    className="flex items-center justify-center focus:outline-none"
                    aria-label={texts[0] || "Rotating element"}
                >
                    {buttonContent}
                </div>
            )}
        </motion.div>
    );
};

export default RotatingButton;
