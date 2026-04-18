// src/components/sections/papers/PapersSection.tsx
"use client";

import { useState } from "react";
import { GiLockedChest, GiOpenTreasureChest } from "react-icons/gi";
import Section from "@/components/ui/Section";
import { PaperItems } from "@/components/sections/papers/PaperItem";
import { papersData } from "@/data/papers";

export default function PapersSection() {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
        {}
    );
    const paperIds = Object.keys(papersData);
    const allExpanded =
        paperIds.length > 0 && paperIds.every((id) => expandedItems[id]);

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleAll = () => {
        if (allExpanded) {
            setExpandedItems({});
        } else {
            const newState: Record<string, boolean> = {};
            paperIds.forEach((id) => {
                newState[id] = true;
            });
            setExpandedItems(newState);
        }
    };

    return (
        <Section
            id="papers"
            headerProps={{
                title: "PaPeRs",
                buttonProps: {
                    onClick: toggleAll,
                    texts: allExpanded
                        ? ["Click Here", "To Collapse All"]
                        : ["Click Here", "To Expand All"],
                    centerIcon: allExpanded
                        ? GiOpenTreasureChest
                        : GiLockedChest,
                    className: "left-1/6",
                },
            }}
        >
            <PaperItems expandedItems={expandedItems} toggleItem={toggleItem} />
        </Section>
    );
}
