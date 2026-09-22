"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import { WorkItems } from "@/components/sections/work/WorkItem";

export default function WorkSection() {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
        {}
    );

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Section
            id="work"
            headerProps={{
                title: "Work",
            }}
        >
            <WorkItems expandedItems={expandedItems} toggleItem={toggleItem} />
        </Section>
    );
}
