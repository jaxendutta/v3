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
    const [prefixWidth, setPrefixWidth] = useState(0);
    const prefixRef = useRef<HTMLDivElement>(null);

    const isActive = isFocused || value.length > 0;
    const isTextarea = type === "textarea";
    // [CLEANUP] Use polymorphic component to avoid code duplication
    const Component = isTextarea ? "textarea" : "input";

    const indexStr = (index + 1).toString().padStart(2, "0");
    const labelText = `${indexStr}. ${label.toUpperCase()}${required ? "*" : ""}`;

    // Measure prefix width for dynamic padding
    useEffect(() => {
        if (isActive && prefix && prefixRef.current) {
            setPrefixWidth(prefixRef.current.getBoundingClientRect().width);
        }
    }, [isActive, prefix]);

    return (
        <div className="relative w-full group">
            {/* Animated Label */}
            <motion.label
                htmlFor={name}
                initial={false}
                animate={{
                    y: isActive ? -4 : 2,
                    scale: isActive ? 0.4 : 1,
                }}
                transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
                className={twMerge(
                    "absolute px-4 z-10 origin-left pointer-events-none text-[30px] transition-colors duration-200",
                    isActive ? "-top-1" : isTextarea ? "top-4" : "top-1/2 -translate-y-1/2 flex items-center",
                    isFocused
                        ? "text-[var(--color-highlight-text)]/80"
                        : "text-current/70 group-hover:text-[var(--color-highlight-text)]"
                )}
            >
                {labelText}
            </motion.label>

            {/* Input Container */}
            <div className="flex w-full items-center relative border-t border-current">
                {/* Prefix Display */}
                {prefix && isActive && (
                    <div
                        ref={prefixRef}
                        className={twMerge(
                            "absolute left-4 z-10 pointer-events-none text-base md:text-xl lg:text-2xl transition-colors duration-200",
                            isFocused
                                ? "text-[var(--color-highlight-text)]/80"
                                : "group-hover:text-[var(--color-highlight-text)]"
                        )}
                    >
                        {prefix}
                    </div>
                )}

                {/* Polymorphic Input Element */}
                <Component
                    id={name}
                    name={name}
                    type={!isTextarea ? type : undefined}
                    rows={isTextarea ? 6 : undefined}
                    required={required}
                    value={value}
                    placeholder=""
                    maxLength={maxLength}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    style={prefix && isActive ? { paddingLeft: `${prefixWidth + 16}px` } : undefined}
                    className={twMerge(
                        "w-full bg-transparent text-2xl px-4 py-4 focus:outline-none transition-colors",
                        "hover:bg-[var(--color-highlight-bg)] hover:text-[var(--color-highlight-text)]",
                        "focus:bg-[var(--color-highlight-bg)] focus:text-[var(--color-highlight-text)]",
                        "placeholder-highlight-text hover:placeholder-[var(--color-highlight-text)]",
                        className
                    )}
                    {...props}
                />
            </div>

            {/* Character Count */}
            {showCount && maxLength && (
                <div className="mt-1 pr-4 text-right text-xs md:text-sm opacity-60">
                    <span className={value.length > maxLength * 0.9 ? "text-red-500" : ""}>
                        {value.length}
                    </span>
                    <span>/{maxLength}</span>
                </div>
            )}
        </div>
    );
};
