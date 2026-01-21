// components/ui/FloatingLabelInput.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface FloatingLabelInputProps
    extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    index: number;
    name: string;
    label: string;
    prefix?: string;
    type?: string;
    required?: boolean;
    maxLength?: number;
    showCount?: boolean;
    className?: string;
    value: string;
}

export const FloatingLabelInput = ({
    index,
    name,
    label,
    prefix,
    type = "text",
    required = false,
    maxLength,
    showCount = false,
    className,
    value = "",
    onChange,
    ...props
}: FloatingLabelInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const isActive = isFocused || value.length > 0;
    const indexStr = (index + 1).toString().padStart(2, "0");
    const prefixRef = useRef<HTMLDivElement>(null);
    const [prefixWidth, setPrefixWidth] = useState(0);
    const isTextarea = type === "textarea";

    // Create label text that will be displayed
    const labelText = `${indexStr}. ${label.toUpperCase()}${required ? "*" : ""}`;

    // Measure the prefix width when it becomes visible
    useEffect(() => {
        if (isActive && prefix && prefixRef.current) {
            setPrefixWidth(prefixRef.current.getBoundingClientRect().width);
        }
    }, [isActive, prefix]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Component for the input or textarea with appropriate styling
    const renderInputElement = () => {
        const commonProps = {
            id: name,
            name,
            required,
            value,
            placeholder: "",
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChange,
            maxLength,
            style:
                prefix && isActive
                    ? { paddingLeft: `${prefixWidth + 16}px` }
                    : undefined,
            ...props,
        };

        // Add more padding for the mobile view
        const commonClasses = twMerge(
            "w-full bg-transparent text-base md:text-xl lg:text-2xl px-4 py-3.5 md:py-4 lg:py-6 focus:outline-none transition-colors",
            className,
            "hover:bg-[var(--color-highlight-bg)] hover:text-[var(--color-highlight-text)]",
            "focus:bg-[var(--color-highlight-bg)] focus:text-[var(--color-highlight-text)]",
            "placeholder-highlight-text"
        );

        if (isTextarea) {
            return (
                <textarea {...commonProps} className={commonClasses} rows={6} />
            );
        }

        return <input {...commonProps} type={type} className={commonClasses} />;
    };

    return (
        <div className="relative w-full">
            {/* Animating Label with responsive text size */}
            <motion.label
                animate={{
                    y: isActive ? -4 : 0,
                    scale: isActive ? 0.6 : 1,
                    opacity: 1,
                }}
                transition={{
                    type: "tween",
                    duration: 0.2,
                    ease: "easeInOut",
                }}
                className={`absolute px-4 z-10 origin-left pointer-events-none text-lg md:text-2xl lg:text-3xl ${
                    isFocused
                        ? "text-[var(--color-highlight-text)]/80"
                        : "text-current/70"
                } ${
                    isActive
                        ? "top-0"
                        : isTextarea
                          ? "top-3 md:top-4 lg:top-5"
                          : "top-1/2 -translate-y-1/2 flex items-center"
                }`}
                htmlFor={name}
            >
                {labelText}
            </motion.label>

            {/* Input Container with Prefix */}
            <div className="flex w-full items-center relative border-t border-current">
                {/* Prefix as absolutely positioned element */}
                {prefix && isActive && (
                    <div
                        ref={prefixRef}
                        className={`absolute left-4 z-10 pointer-events-none text-base md:text-xl lg:text-2xl ${
                            isFocused
                                ? "text-[var(--color-highlight-text)]/80"
                                : "text-current/70"
                        }`}
                    >
                        {prefix}
                    </div>
                )}

                {/* Render the appropriate input element */}
                {renderInputElement()}
            </div>

            {/* Word Count Display */}
            {showCount && maxLength && (
                <div className="mt-1 pr-4 text-right text-xs md:text-sm opacity-60">
                    <span
                        className={
                            value.length > maxLength * 0.9 ? "text-red-500" : ""
                        }
                    >
                        {value.length}
                    </span>
                    <span>/{maxLength}</span>
                </div>
            )}
        </div>
    );
};
