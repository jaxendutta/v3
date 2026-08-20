import React from "react";

export type DATE_FORMAT_OPTIONS =
    | "DD-MM-YYYY"
    | "YYYY-MM-DD"
    | "DD Month YYYY"
    | "DD Mon YYYY"
    | "Month YYYY"
    | "Mon YYYY"
    | "Weekday, DD Month YYYY";

export const formatDate = (date: Date | string, format: DATE_FORMAT_OPTIONS = "DD-MM-YYYY"): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { timeZone: "America/Toronto" };

    const day = d.toLocaleString("en-CA", { ...options, day: "2-digit" });
    const month = d.toLocaleString("en-CA", { ...options, month: "2-digit" });
    const year = d.toLocaleString("en-CA", { ...options, year: "numeric" });
    const monthLong = d.toLocaleString("en-CA", { ...options, month: "long" });
    const monthShort = d.toLocaleString("en-CA", { ...options, month: "short" });
    const dayShort = d.toLocaleString("en-CA", { ...options, weekday: "short" });
    const dayLong = d.toLocaleString("en-CA", { ...options, weekday: "long" });

    switch (format) {
        case "DD-MM-YYYY":
            return `${day}-${month}-${year}`;
        case "YYYY-MM-DD":
            return `${year}-${month}-${day}`;
        case "DD Month YYYY":
            return `${day} ${monthLong} ${year}`;
        case "DD Mon YYYY":
            return `${day} ${monthShort} ${year}`;
        case "Month YYYY":
            return `${monthLong} ${year}`;
        case "Mon YYYY":
            return `${monthShort} ${year}`;
        case "Weekday, DD Month YYYY":
            return `${dayLong}, ${day} ${monthLong} ${year}`;
        default:
            return `${day}-${month}-${year}`;
    }
};

/**
 * Formats a project title so bracketed tags (e.g. "[ v2 ]", "[ EMMA ]") never break internally across lines.
 * Replaces internal spaces with non-breaking spaces (\u00A0) and wraps bracketed segments in inline-block whitespace-nowrap.
 */
export function renderFormattedTitle(title: string): React.ReactNode {
    if (!title) return null;

    const parts = title.split(/(\[[^\]]+\])/g);

    return parts.map((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) {
            const nonBreakingPart = part.replace(/\s+/g, "\u00A0");
            return (
                <span key={index} className="inline-block whitespace-nowrap">
                    {nonBreakingPart}
                </span>
            );
        }
        return part;
    });
}
