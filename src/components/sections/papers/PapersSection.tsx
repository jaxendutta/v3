// src/components/sections/papers/PapersSection.tsx
"use client";

import { useState, useMemo } from "react";
import Section from "@/components/ui/Section";
import { PaperItems } from "@/components/sections/papers/PaperItem";
import { papersData } from "@/data/papers";
import Link from "next/link";

export default function PapersSection({ limit, showLink }: { limit?: number, showLink?: boolean }) {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    // Sort papers chronologically (newest first)
    const allPaperIds = useMemo(() => {
        return Object.entries(papersData)
            .sort((a, b) => b[1].duration.end.getTime() - a[1].duration.end.getTime())
            .map(([id]) => id);
    }, []);

    // Apply the limit if provided
    const paperIds = limit ? allPaperIds.slice(0, limit) : allPaperIds;

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <Section
            id="papers"
            headerProps={{
                title: "Papers",
            }}
        >
            <PaperItems expandedItems={expandedItems} toggleItem={toggleItem} paperIds={paperIds} />

            {showLink && (
                <Link href="/papers" className={`flex justify-center no-underline! border-b border-foreground hover:bg-foreground hover:text-background! py-3 mb-8 transition-all duration-500 uppercase text-[13px] md:text-base`}>
                    view all papers + written records
                </Link>
            )}
        </Section>
    );
}
