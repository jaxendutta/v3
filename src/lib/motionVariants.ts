// src/lib/motionVariants.ts
import { Variants } from "framer-motion";
import { useMemo } from "react";

export function useGlitchAnimation(steps = 50) {
    return useMemo(() => {
        const fontWeights = [100, 200, 300, 400, 500, 600, 700];
        const fontStyles = ["normal", "italic"];
        const textDecorations = ["none", "underline", "line-through"];
        const textTransforms = ["none", "uppercase", "lowercase", "capitalize"];

        const getRandomFrom = <T>(array: T[]): T =>
            array[Math.floor(Math.random() * array.length)];

        const animation = {
            fontWeight: Array.from({ length: steps }, () =>
                getRandomFrom(fontWeights)
            ),
            fontStyle: Array.from({ length: steps }, () =>
                getRandomFrom(fontStyles)
            ),
            textDecoration: Array.from({ length: steps }, () =>
                getRandomFrom(textDecorations)
            ),
            textTransform: Array.from({ length: steps }, () =>
                getRandomFrom(textTransforms)
            ),
            scale: Array.from(
                { length: steps },
                () => 0.98 + Math.random() * 0.04
            ),
            skewX: Array.from(
                { length: steps },
                () => (Math.random() - 0.5) * 4
            ),
            opacity: Array.from(
                { length: steps },
                () => 0.9 + Math.random() * 0.1
            ),
        };

        return animation;
    }, [steps]);
}

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Slide up animation
 */
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Slide in from left animation
 */
export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Slide in from right animation
 */
export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Container variant for staggered children animations
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

/**
 * Scale up animation
 */
export const scaleUp: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Rotate in animation
 */
export const rotateIn: Variants = {
    hidden: { opacity: 0, rotate: -10 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: {
            duration: 0.5,
        },
    },
};

/**
 * Pop up animation
 */
export const popUp: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        },
    },
};
