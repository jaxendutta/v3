// src/components/ui/RotatingButton.tsx
"use client";

import { useState, useEffect, useId, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconType } from "react-icons";

export interface RotatingButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    texts: string[];
    delimiters?: string[];
    size?: number | { default: number; md?: number; lg?: number };
    variant?: "default" | "frost" | "raised" | "glow" | "wavy";
    href?: string;
    onClick?: () => void;
    centerIcon?: IconType;
    className?: string;
    rotationDuration?: number;
    fontSize?: number | { default: number; md?: number; lg?: number };
    disabled?: boolean;
    wavyPadding?: number;
}

// Generate smooth, natural wavy circle badge with round crests and wide, pillowy valleys
function generateWavyCirclePath(
    cx: number,
    cy: number,
    radius: number,
    amplitude: number = 3.8,
    waves: number = 12
): string {
    const rCrest = radius + amplitude;
    const rTrough = radius - amplitude * 0.85;
    const lFactor = 0.44;

    let d = "";

    for (let i = 0; i < waves; i++) {
        const thetaPeak = (i * 2 * Math.PI) / waves;
        const thetaValley = ((i + 0.5) * 2 * Math.PI) / waves;
        const thetaNextPeak = ((i + 1) * 2 * Math.PI) / waves;

        const pPeak = {
            x: cx + rCrest * Math.cos(thetaPeak),
            y: cy + rCrest * Math.sin(thetaPeak),
        };
        const pValley = {
            x: cx + rTrough * Math.cos(thetaValley),
            y: cy + rTrough * Math.sin(thetaValley),
        };
        const pNextPeak = {
            x: cx + rCrest * Math.cos(thetaNextPeak),
            y: cy + rCrest * Math.sin(thetaNextPeak),
        };

        const tPeak = { x: -Math.sin(thetaPeak), y: Math.cos(thetaPeak) };
        const tValley = { x: -Math.sin(thetaValley), y: Math.cos(thetaValley) };
        const tNextPeak = { x: -Math.sin(thetaNextPeak), y: Math.cos(thetaNextPeak) };

        const dist1 = Math.hypot(pValley.x - pPeak.x, pValley.y - pPeak.y);
        const dist2 = Math.hypot(pNextPeak.x - pValley.x, pNextPeak.y - pValley.y);

        const c1 = {
            x: pPeak.x + tPeak.x * dist1 * lFactor,
            y: pPeak.y + tPeak.y * dist1 * lFactor,
        };
        const c2 = {
            x: pValley.x - tValley.x * dist1 * lFactor,
            y: pValley.y - tValley.y * dist1 * lFactor,
        };
        const c3 = {
            x: pValley.x + tValley.x * dist2 * lFactor,
            y: pValley.y + tValley.y * dist2 * lFactor,
        };
        const c4 = {
            x: pNextPeak.x - tNextPeak.x * dist2 * lFactor,
            y: pNextPeak.y - tNextPeak.y * dist2 * lFactor,
        };

        if (i === 0) {
            d += `M ${pPeak.x.toFixed(2)} ${pPeak.y.toFixed(2)}`;
        }
        d += ` C ${c1.x.toFixed(2)} ${c1.y.toFixed(2)}, ${c2.x.toFixed(2)} ${c2.y.toFixed(2)}, ${pValley.x.toFixed(2)} ${pValley.y.toFixed(2)}`;
        d += ` C ${c3.x.toFixed(2)} ${c3.y.toFixed(2)}, ${c4.x.toFixed(2)} ${c4.y.toFixed(2)}, ${pNextPeak.x.toFixed(2)} ${pNextPeak.y.toFixed(2)}`;
    }

    d += " Z";
    return d;
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
    wavyPadding = 7,
}) => {
    texts = texts.map((text) => text.toUpperCase());
    const pathId = `circle-path-${useId().replace(/:/g, "")}`;
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

    // Calculate wavy path for wavy variant with comfortable breathing room from inner text
    const amplitude = Math.max(3.5, radius * 0.09);
    const wavyPad = wavyPadding + amplitude + 6;
    const wavyPath = useMemo(() => {
        if (variant !== "wavy") return "";
        return generateWavyCirclePath(radius, radius, radius + wavyPadding, amplitude, 12);
    }, [variant, radius, wavyPadding, amplitude]);

    // Apply variant-specific styles
    const getVariantClass = () => {
        switch (variant) {
            case "frost":
                return "bg-opacity-10 backdrop-blur-md shadow-md";
            case "raised":
                return "shadow-md hover:shadow-lg";
            case "glow":
                return "bg-theme shadow-[0_0_15px_15px_var(--color-background)] hover:shadow-[0_0_45px_45px_var(--color-background)]";
            case "wavy":
                return "";
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
            {/* Wavy silhouette backdrop - completely invisible on default page background,
                crisply reveals itself as a scalloped mask when scrolling over different-colored content */}
            {variant === "wavy" && (
                <svg
                    className="absolute pointer-events-none select-none transition-transform duration-300 group-hover:scale-105"
                    style={{
                        width: currentSize + wavyPad * 2,
                        height: currentSize + wavyPad * 2,
                        top: -wavyPad,
                        left: -wavyPad,
                    }}
                    viewBox={`${-wavyPad} ${-wavyPad} ${currentSize + wavyPad * 2} ${currentSize + wavyPad * 2}`}
                    aria-hidden="true"
                >
                    <path
                        d={wavyPath}
                        fill="var(--color-background)"
                        stroke="var(--color-background)"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        className="transition-colors duration-200 group-hover:stroke-accent/50"
                    />
                </svg>
            )}
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
