// src/components/sections/papers/PaperItem.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Paper, PaperDocument, DocumentType } from "@/types/paper";
import { papersData } from "@/data/papers";
import Tag from "@/components/ui/Tag";
import CollapsibleItem from "@/components/ui/CollapsibleItem";
import { sansFont, serifFont, serifSCFont } from "@/lib/fonts";
import { formatDate } from "@/lib/format";
import {
    HiOutlineDocumentText,
} from "react-icons/hi";
import {
    HiOutlinePhoto,
    HiOutlinePresentationChartBar,
} from "react-icons/hi2";
import { RiFile3Line } from "react-icons/ri";
import { TbGridDots } from "react-icons/tb";

// ── Document type → icon ──────────────────────────────────────────────────────

const DOC_ICONS: Record<DocumentType, React.ElementType> = {
    paper: RiFile3Line,
    poster: HiOutlinePhoto,
    slides: HiOutlinePresentationChartBar,
    project: TbGridDots,
};

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
    published: "border-green-500 text-green-500",
    submitted: "border-blue-500 text-blue-500",
    "in-review": "border-yellow-500 text-yellow-500",
    draft: "border-current text-muted-foreground-subtle",
};

function StatusBadge({ status }: { status: Paper["status"] }) {
    if (!status) return null;
    return (
        <span
            className={`text-[9px] md:text-xs font-mono uppercase tracking-widest border px-2 py-0.5 rounded-full ${STATUS_STYLES[status] ?? "border-current opacity-50"
                }`}
        >
            {status}
        </span>
    );
}

// ── Document link button ──────────────────────────────────────────────────────

function DocLink({
    paperId,
    formatKey,
    doc,
}: {
    paperId: string;
    formatKey: string;
    doc: PaperDocument;
}) {
    const [isHovered, setIsHovered] = useState(false);

    const url =
        doc.type === "project"
            ? `/projects/${paperId}`
            : `/papers/${paperId}/${paperId}-${formatKey}.pdf`;

    const Icon = DOC_ICONS[doc.type] ?? HiOutlineDocumentText;

    return (
        <motion.div
            className="relative inline-flex items-center gap-2 px-3 py-1.5 border border-current text-xs md:text-sm cursor-pointer"
            whileHover={{
                backgroundColor: "var(--color-text)",
                color: "var(--color-background)",
            }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={url}
                target={doc.type === "project" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
                className="flex items-center gap-2"
            >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{doc.label}</span>
            </Link>
        </motion.div>
    );
}

// ── PaperItem ─────────────────────────────────────────────────────────────────

export const PaperItem = ({
    data,
    paperId,
    index,
    isActive,
    onToggle,
}: {
    data: Paper;
    paperId: string;
    index: number;
    isActive: boolean;
    onToggle: () => void;
}) => {
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(true); // Tracks the CSS class separately
    const docEntries = Object.entries(data.links);

    const header = (
        <div className="flex flex-col justify-center gap-0.5 pr-2 md:pr-8">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className={`${serifFont} italic text-[15px] md:text-2xl`}>
                    {data.title}
                </span>
                <StatusBadge status={data.status} />
            </div>
            <span
                className={
                    `${sansFont} font-thin text-[13px] md:text-base text-muted-foreground md:tracking-wide` +
                    (!isActive ? " group-hover:text-highlight-text" : "")
                }
            >
                {data.paperType}
                {data.venue && data.venue.length > 0 && (
                    <> ✧ {data.venue.join(" ✧ ")}</>
                )}
                <span className="hidden lg:inline">
                    {(data.venue && data.venue.length > 0) && " ✧ "}
                    {formatDate(data.duration.end, "DD Month YYYY")}
                </span>
            </span>
        </div>
    );

    const inlineLinksSection = docEntries.length > 0 ? (
        <>
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground-subtle">
                Links
            </p>
            <div className="flex flex-wrap gap-2">
                {docEntries.map(([key, doc]) => (
                    <DocLink
                        key={key}
                        paperId={paperId}
                        formatKey={key}
                        doc={doc}
                    />
                ))}
            </div>
        </>
    ) : null;

    return (
        <CollapsibleItem
            header={header}
            index={index}
            isActive={isActive}
            onToggle={onToggle}
            duration={data.duration}
        >
            <div className="flex flex-col gap-6 px-2 pt-4 pb-6 md:pt-2 md:pb-8 md:px-4 pr-12 md:pr-20 lg:pr-24">
                {/* Tags always on top */}
                <div className="flex flex-wrap gap-1.5 md:gap-2.5">
                    {data.tags.map((tag) => (
                        <Tag key={`${paperId}-${tag}`} text={tag} />
                    ))}
                </div>

                {/* Abstract + Links combined layout */}
                <div
                    className="flex flex-col lg:flex-row gap-2 lg:gap-4 w-full"
                >
                    {/* Links panel: only one, above on small, right on lg+ */}
                    {docEntries.length > 0 && (
                        <div className="flex flex-col gap-2 w-full items-start mb-2 lg:mb-0 lg:w-auto lg:items-end lg:order-2 lg:justify-start lg:min-w-0 lg:max-w-[25%] lg:flex-grow-0 lg:flex-shrink-0 lg:basis-auto">
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground-subtle mb-1 lg:mb-0">
                                Links
                            </p>
                            <div className="flex flex-wrap gap-2 w-full justify-start lg:justify-end">
                                {docEntries.map(([key, doc]) => (
                                    <DocLink
                                        key={key}
                                        paperId={paperId}
                                        formatKey={key}
                                        doc={doc}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Abstract (below links on small, left on lg+) */}
                    <div className="flex-grow min-w-0 max-w-full lg:max-w-[75%] lg:order-1">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground-subtle">
                                Abstract
                            </p>
                            {/* Toggle button - only visible on smaller screens */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isTextExpanded) {
                                        setIsClamped(false);
                                        setIsTextExpanded(true);
                                    } else {
                                        setIsTextExpanded(false);
                                    }
                                }}
                                className="md:hidden text-[9px] font-mono uppercase tracking-widest border-b border-current text-muted-foreground-subtle hover:opacity-100 transition-opacity"
                            >
                                {isTextExpanded ? "Read Less" : "Read More"}
                            </button>
                        </div>
                        <motion.div
                            className="w-full h-0.25 origin-left bg-current mb-3"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                        />
                        <motion.div
                            initial={false}
                            animate={{
                                height: isTextExpanded ? "auto" : "4.875rem"
                            }}
                            onAnimationComplete={() => {
                                if (!isTextExpanded) {
                                    setIsClamped(true);
                                }
                            }}
                            className="overflow-hidden md:!h-auto"
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <p
                                className={`text-xs md:text-sm leading-relaxed text-muted-foreground ${isClamped
                                    ? "line-clamp-4 text-left md:line-clamp-none md:text-justify"
                                    : "text-justify"
                                    }`}
                            >
                                {data.abstract}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </CollapsibleItem>
    );
};

// ── Hover wrapper ─────────────────────────────────────────────────────────────

export const PaperItemWithHover = (props: {
    data: Paper;
    paperId: string;
    index: number;
    isActive: boolean;
    onToggle: () => void;
}) => {
    return (
        <motion.div
            whileHover={
                !props.isActive
                    ? {
                        backgroundColor: "var(--color-highlight-bg)",
                        color: "var(--color-highlight-text)",
                    }
                    : {}
            }
            className="group"
        >
            <PaperItem {...props} />
        </motion.div>
    );
};

// ── PaperItems list ───────────────────────────────────────────────────────────

export const PaperItems = ({
    expandedItems,
    toggleItem,
    paperIds,
}: {
    expandedItems: Record<string, boolean>;
    toggleItem: (id: string) => void;
    paperIds?: string[];
}) => {
    // If no specific IDs are provided, map over all of them.
    const idsToRender = paperIds || Object.keys(papersData);

    return idsToRender.map((id, index) => (
        <PaperItemWithHover
            key={id}
            paperId={id}
            data={papersData[id]}
            index={index}
            isActive={!!expandedItems[id]}
            onToggle={() => toggleItem(id)}
        />
    ));
};
