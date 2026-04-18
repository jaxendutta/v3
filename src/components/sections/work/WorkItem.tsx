// src/components/sections/work/WorkItem.tsx
"use client";

import { motion } from "framer-motion";
import { WorkExperience } from "@/types/work";
import parse from "html-react-parser";
import { workData } from "@/data/work";
import StyledLink from "@/components/ui/StyledLink";
import Tag from "@/components/ui/Tag";
import CollapsibleItem from "@/components/ui/CollapsibleItem";

// ── WorkItem ──────────────────────────────────────────────────────────────────

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
    const header = (
        <div className="flex flex-col justify-center pr-4 md:pr-8 gap-0.5">
            <div className="text-base md:text-2xl leading-[1.2]">
                {data.title}
            </div>
            <StyledLink
                href={data.url}
                className="z-30 font-thin flex flex-wrap items-center gap-1 text-inherit text-xs md:text-xl no-underline"
                onClick={(e) => e.stopPropagation()}
                text={data.company}
            />
        </div>
    );

    return (
        <CollapsibleItem
            header={header}
            index={index}
            isActive={isActive}
            onToggle={onToggle}
            duration={data.duration}
        >
            <div className="flex flex-col px-2 pt-4 pb-6 md:py-8 md:px-4 pr-12 md:pr-20 lg:pr-24">
                {/* Skills tags */}
                <div className="mb-2 md:mb-6 flex flex-wrap justify-start gap-1.5 md:gap-2.5">
                    {data.skills.map((skill) => (
                        <Tag key={skill} text={skill} />
                    ))}
                </div>

                {/* Team info */}
                {data.team && (
                    <div className="mb-4 w-full border-b border-current pt-4 pb-2 text-sm md:text-xl">
                        {data.team.url ? (
                            <StyledLink href={data.team.url} text={data.team.name} />
                        ) : (
                            data.team.name
                        )}
                    </div>
                )}

                {/* Description paragraphs */}
                <div className="space-y-4">
                    {data.description.map((desc, i) => (
                        <div key={i} className="text-xs md:text-base">
                            {parse(desc)}
                        </div>
                    ))}
                </div>
            </div>
        </CollapsibleItem>
    );
};

// ── Hover wrapper ─────────────────────────────────────────────────────────────

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

// ── WorkItems list ────────────────────────────────────────────────────────────

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
