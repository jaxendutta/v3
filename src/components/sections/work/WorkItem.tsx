// src/components/sections/work/WorkItem.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkExperience } from "@/types/work";
import parse from "html-react-parser";
import { RxPlus } from "react-icons/rx";
import { workData } from "@/data/workData";
import StyledLink from "@/components/ui/StyledLink";
import Tag from "@/components/ui/Tag";

export const WorkItem = ({
    data,
    index,
    isActive,
    onToggle,
}: {
    data: WorkExperience;
    index: number;
    isActive: boolean;
    onToggle: () => void;
}) => {
    return (
        <div className={`w-full border-b border-current`}>
            {/* Header section - clickable */}
            <div
                className={`flex h-24 items-center justify-between px-2 py-2 md:px-4 ${!isActive && "cursor-pointer"}`}
                onClick={() => !isActive && onToggle()}
            >
                <div className="flex items-center">
                    <div className="mr-5 flex items-center text-3xl md:text-4xl lg:text-5xl">
                        {(index + 1).toString().padStart(2, "0")}.
                    </div>
                    <div className="flex-grow flex flex-col justify-center pr-8">
                        <div className="text-lg md:text-2xl md:font-medium">
                            {data.title}
                        </div>
                        <StyledLink
                            href={data.url}
                            className="z-30 flex flex-wrap items-center gap-1 text-inherit text-sm no-underline md:text-xl"
                            onClick={(e) => e.stopPropagation()}
                            text={data.company}
                        />
                    </div>
                </div>

                {/* Toggle button */}
                <motion.button
                    className="relative flex flex-shrink-0 cursor-pointer items-center justify-center rounded-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    aria-label={
                        isActive ? "Collapse section" : "Expand section"
                    }
                    initial={false}
                    animate={{
                        rotate: isActive ? 45 : 0,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                >
                    <RxPlus className="h-6 w-6 flex-shrink-0 md:h-8 md:w-8" />
                </motion.button>
            </div>

            {/* Content section - with proper dropdown animation */}
            <AnimatePresence initial={false}>
                {isActive && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                        className="overflow-hidden"
                    >
                        <div className="relative flex flex-row px-2 pb-8 md:px-4">
                            {/* Main content */}
                            <div className="w-3/4 pr-8">
                                {/* Skills tags */}
                                <div className="mb-6 flex flex-wrap justify-start gap-2.5 pointer-events-auto">
                                    {data.skills.map((skill) => (
                                        <Tag key={skill} text={skill} />
                                    ))}
                                </div>

                                {/* Team info if available */}
                                {data.team && (
                                    <div className="mb-4 w-full border-b border-current pt-4 pb-2 text-xl">
                                        {data.team.url ? (
                                            <StyledLink
                                                href={data.team.url}
                                                text={data.team.name}
                                            />
                                        ) : (
                                            data.team.name
                                        )}
                                    </div>
                                )}

                                {/* Description paragraphs */}
                                <div className="space-y-4">
                                    {data.description.map((desc, i) => (
                                        <div key={i} className="text-base">
                                            {parse(desc)}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Date timeline */}
                            <div className="absolute right-4 top-0 bottom-0 flex flex-col items-center justify-between pb-8 md:right-6 lg:right-8">
                                <span className="[writing-mode:vertical-rl] text-orientation-mixed text-sm  whitespace-nowrap">
                                    {new Date(data.duration.start)
                                        .toLocaleString("en", {
                                            year: "numeric",
                                            month: "short",
                                        })
                                        .toUpperCase()}
                                </span>

                                <motion.div
                                    className="my-2.5 h-full w-0.5 flex-grow origin-top bg-current"
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    exit={{ scaleY: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                        delay: 0.05,
                                    }}
                                />

                                <span className="[writing-mode:vertical-rl] text-orientation-mixed text-sm whitespace-nowrap">
                                    {new Date(data.duration.end)
                                        .toLocaleString("en", {
                                            year: "numeric",
                                            month: "short",
                                        })
                                        .toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Hover effect handling for work items
export const WorkItemWithHover = (props: {
    data: WorkExperience;
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
        >
            <WorkItem {...props} />
        </motion.div>
    );
};

export const WorkItems = ({
    expandedItems,
    toggleItem,
}: {
    expandedItems: Record<string, boolean>;
    toggleItem: (id: string) => void;
}) => {
    return Object.entries(workData).map(([id, experience], index) => (
        <WorkItemWithHover
            key={id}
            data={experience}
            index={index}
            isActive={!!expandedItems[id]}
            onToggle={() => toggleItem(id)}
        />
    ));
};
