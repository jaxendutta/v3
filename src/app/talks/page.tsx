// src/app/talks/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motionVariants";
import { presentationsData } from "@/data/presentations";
import { computeFacetCounts, parseCsvNumberList, parseCsvStringList, useSyncedFilters } from "@/lib/filtering";
import { PresentationItems } from "@/components/sections/talks/PresentationItem";
import FilteredCollectionPage from "@/components/layout/FilteredCollectionPage";
import { FilterTag, FilterSection } from "@/components/ui/FilterContainer";
import { LuCalendarRange, LuSearch, LuSwatchBook } from "react-icons/lu";
import { TbFilterDown } from "react-icons/tb";

export default function TalksPage() {
    const [showFilters, setShowFilters] = useState(false);
    const { searchQuery, setSearchQuery, filters, toggleFilterValue, clearFilters, hasActiveFilters } = useSyncedFilters<{
        tags: string[];
        years: number[];
        presentationTypes: string[];
    }>({
        filterParams: {
            tags: "tag",
            years: "year",
            presentationTypes: "type",
        },
        parseFilter: {
            tags: parseCsvStringList,
            years: parseCsvNumberList,
            presentationTypes: parseCsvStringList,
        },
    });

    const selectedTags = filters.tags;
    const selectedYears = filters.years;
    const selectedPresentationTypes = filters.presentationTypes;

    const allIds = useMemo(() => {
        return Object.entries(presentationsData)
            .sort((a, b) => b[1].duration.end.getTime() - a[1].duration.end.getTime())
            .map(([id]) => id);
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allIds.forEach((id) => presentationsData[id].tags?.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
    }, [allIds]);

    const allYears = useMemo(() => {
        const years = new Set<number>();
        allIds.forEach((id) => {
            if (presentationsData[id].duration?.end) {
                years.add(presentationsData[id].duration.end.getFullYear());
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [allIds]);

    const allPresentationTypes = useMemo(() => {
        const types = new Set<string>();
        allIds.forEach((id) => {
            if (presentationsData[id].presentationType) {
                types.add(presentationsData[id].presentationType);
            }
        });
        return Array.from(types).sort();
    }, [allIds]);

    const matchesSearch = (p: (typeof presentationsData)[string]) =>
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.abstract.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = (p: (typeof presentationsData)[string], tags: string[]) =>
        tags.length === 0 || tags.every((t) => p.tags?.includes(t));

    const matchesYear = (p: (typeof presentationsData)[string], years: number[]) =>
        years.length === 0 || (p.duration?.end && years.includes(p.duration.end.getFullYear()));

    const matchesType = (p: (typeof presentationsData)[string], types: string[]) =>
        types.length === 0 || types.includes(p.presentationType);

    const tagCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allIds,
                values: allTags,
                selectedValues: selectedTags,
                isMatch: (id, nextTags) => {
                    const p = presentationsData[id];
                    return matchesSearch(p) && matchesTags(p, nextTags) && matchesYear(p, selectedYears) && matchesType(p, selectedPresentationTypes);
                },
            }),
        [allIds, allTags, selectedTags, selectedYears, selectedPresentationTypes, searchQuery]
    );

    const yearCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allIds,
                values: allYears,
                selectedValues: selectedYears,
                isMatch: (id, nextYears) => {
                    const p = presentationsData[id];
                    return matchesSearch(p) && matchesTags(p, selectedTags) && matchesYear(p, nextYears) && matchesType(p, selectedPresentationTypes);
                },
            }),
        [allIds, allYears, selectedYears, selectedTags, selectedPresentationTypes, searchQuery]
    );

    const typeCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allIds,
                values: allPresentationTypes,
                selectedValues: selectedPresentationTypes,
                isMatch: (id, nextTypes) => {
                    const p = presentationsData[id];
                    return matchesSearch(p) && matchesTags(p, selectedTags) && matchesYear(p, selectedYears) && matchesType(p, nextTypes);
                },
            }),
        [allIds, allPresentationTypes, selectedPresentationTypes, selectedTags, selectedYears, searchQuery]
    );

    const filtered = useMemo(
        () =>
            allIds.filter((id) => {
                const p = presentationsData[id];
                return matchesSearch(p) && matchesTags(p, selectedTags) && matchesYear(p, selectedYears) && matchesType(p, selectedPresentationTypes);
            }),
        [allIds, searchQuery, selectedTags, selectedYears, selectedPresentationTypes]
    );

    const summary = (
        <>
            <span className="font-medium text-accent">
                {filtered.length} / {allIds.length}
            </span>
            <span>{" talks found "}</span>
            {selectedPresentationTypes.length > 0 && (
                <>
                    {" filtered by "}
                    <span className="text-accent">
                        {selectedPresentationTypes.length} {selectedPresentationTypes.length === 1 ? "type" : "types"}
                    </span>
                </>
            )}
            {selectedTags.length > 0 && (
                <>
                    {" with "}
                    <span className="text-accent">
                        {selectedTags.length} {selectedTags.length === 1 ? "theme" : "themes"}
                    </span>
                </>
            )}
            {selectedYears.length > 0 && (
                <>
                    {" from "}
                    <span className="text-accent">
                        {selectedYears.length === 1 ? "the year" : "years"} {selectedYears.join(", ")}
                    </span>
                </>
            )}
            {searchQuery && (
                <>
                    {" matching "}
                    <span className="text-accent italic">&quot;{searchQuery}&quot;</span>
                </>
            )}
        </>
    );

    const filtersPanel = (
        <div className="flex flex-col gap-6">
            <div className="w-full">
                <div className="relative">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search titles and descriptions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-8 pr-4 border border-current bg-transparent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col xl:grid xl:grid-cols-4 xl:gap-4 gap-8">
                <FilterSection title="Theme Filter" icon={<LuSwatchBook />} className="xl:col-span-3">
                    {allTags.map((tag) => (
                        <FilterTag
                            key={tag}
                            label={tag}
                            count={tagCounts[tag] ?? 0}
                            isActive={selectedTags.includes(tag)}
                            onClick={() => toggleFilterValue("tags", tag)}
                        />
                    ))}
                </FilterSection>
                <div className="flex flex-col gap-4 xl:gap-0 xl:flex-col xl:col-span-1">
                    {allYears.length > 0 && (
                        <FilterSection title="Year Filter" icon={<LuCalendarRange />} className="mb-4">
                            {allYears.map((year) => (
                                <FilterTag
                                    key={year}
                                    label={year.toString()}
                                    count={yearCounts[year] ?? 0}
                                    isActive={selectedYears.includes(year)}
                                    onClick={() => toggleFilterValue("years", year)}
                                />
                            ))}
                        </FilterSection>
                    )}
                    {allPresentationTypes.length > 0 && (
                        <FilterSection title="Talk Type Filter" icon={<TbFilterDown />}>
                            {allPresentationTypes.map((type) => (
                                <FilterTag
                                    key={type}
                                    label={type}
                                    count={typeCounts[type] ?? 0}
                                    isActive={selectedPresentationTypes.includes(type)}
                                    onClick={() => toggleFilterValue("presentationTypes", type)}
                                />
                            ))}
                        </FilterSection>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <FilteredCollectionPage
            backHref="/"
            backTexts={["Back Home", "Over & Out"]}
            title="Talks & Presentations."
            titleClassName="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] pb-8 md:pb-10 lg:pb-12 md:max-w-[80vw] mx-auto"
            summary={summary}
            isFilterVisible={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            filterPanel={filtersPanel}
            mainClassName="containerd border-t border-current"
        >
            {filtered.length > 0 ? (
                <motion.div variants={fadeIn} initial="hidden" animate="visible" className="max-w-[1440px] mx-auto">
                    <PresentationItems presentationIds={filtered} />
                </motion.div>
            ) : (
                <motion.div className="text-center py-20" variants={fadeIn} initial="hidden" animate="visible">
                    <p className="mb-8 text-accent">No talks found matching your criteria!</p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 border border-current hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors"
                    >
                        Clear all filters
                    </button>
                </motion.div>
            )}
        </FilteredCollectionPage>
    );
}
