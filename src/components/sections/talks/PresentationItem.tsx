// src/components/sections/talks/PresentationItem.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Presentation } from "@/types/presentation";
import { presentationsData } from "@/data/presentations";
import { sansFont, serifFont } from "@/lib/fonts";
import { formatDate } from "@/lib/format";

// Status badge

const STATUS_STYLES: Record<string, string> = {
    presented: "border-green-500 text-green-500",
    upcoming: "border-blue-500 text-blue-500",
    cancelled: "border-red-500 text-red-500 line-through opacity-60",
};

function StatusBadge({ status }: { status: Presentation["status"] }) {
    if (!status) return null;
    return (
        <span className={`inline-flex items-center align-middle text-[9px] md:text-xs font-mono uppercase tracking-widest border px-1.5 md:px-2 py-0.75 md:py-1 rounded-full leading-none ${STATUS_STYLES[status] ?? "border-current opacity-50"}`}>
            {status}
        </span>
    );
}

// PresentationItem (link row)

export const PresentationItem = ({
    data,
    talkId,
    index,
}: {
    data: Presentation;
    talkId: string;
    index: number;
}) => {
    return (
        <div className="w-full border-b border-current">
            <motion.div
                whileHover={{
                    backgroundColor: "var(--color-highlight-bg)",
                    color: "var(--color-highlight-text)",
                }}
                className="group"
            >
                <Link
                    href={`/talks/${talkId}`}
                    className="flex items-center justify-between px-0.5 py-3 md:py-5 md:px-4 no-underline"
                    style={{ color: "inherit", textDecoration: "none" }}
                >
                    <div className="flex items-start md:items-center gap-2.5 md:gap-5 flex-1 min-w-0">
                        {/* Index */}
                        <div className="flex-shrink-0 flex items-center text-2xl md:text-4xl lg:text-5xl font-thin">
                            {(index + 1).toString().padStart(2, "0")}.
                        </div>

                        {/* Title + meta */}
                        <div className="flex flex-col justify-center gap-0.5 pr-2 md:pr-8 flex-1 min-w-0">
                            <p className={`${serifFont} italic text-[15px] md:text-2xl mb-0.5 space-x-1`}>
                                <span dangerouslySetInnerHTML={{ __html: data.title }} />
                                {data.status && <> <StatusBadge status={data.status} /></>}
                            </p>
                            <span className={`${sansFont} font-thin text-[13px] md:text-base text-muted-foreground md:tracking-wide group-hover:text-highlight-text`}>
                                {data.presentationType}
                                {(data.event?.short ?? data.event?.long) && (
                                    <> ✧ <span dangerouslySetInnerHTML={{ __html: data.event?.short ?? data.event?.long ?? "" }} /></>
                                )}
                                <span className="hidden lg:inline">
                                    {data.event && " ✧ "}
                                    {formatDate(data.duration.end, "DD Month YYYY")}
                                </span>
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
};

// PresentationItems list

export const PresentationItems = ({
    presentationIds,
}: {
    presentationIds?: string[];
    // kept for API compatibility with talks/page.tsx
    expandedItems?: Record<string, boolean>;
    toggleItem?: (id: string) => void;
}) => {
    const idsToRender = presentationIds ?? Object.keys(presentationsData);

    return idsToRender.map((id, index) => (
        <PresentationItem
            key={id}
            talkId={id}
            data={presentationsData[id]}
            index={index}
        />
    ));
};
