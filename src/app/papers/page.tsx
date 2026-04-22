// src/app/papers/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motionVariants";
import { papersData } from "@/data/papers";
import { computeFacetCounts, parseCsvNumberList, parseCsvStringList, useSyncedFilters } from "@/lib/filtering";
import { PaperItems } from "@/components/sections/papers/PaperItem";
import FilteredCollectionPage from "@/components/layout/FilteredCollectionPage";
import { FilterTag, FilterSection } from "@/components/ui/FilterContainer";
import { LuCalendarRange, LuSearch, LuSwatchBook } from "react-icons/lu";
import { TbFilterDown } from "react-icons/tb";

export default function PapersPage() {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [showFilters, setShowFilters] = useState(false);
    const { searchQuery, setSearchQuery, filters, toggleFilterValue, clearFilters, hasActiveFilters } = useSyncedFilters<{
        tags: string[];
        years: number[];
        paperTypes: string[];
    }>({
        filterParams: {
            tags: "tag",
            years: "year",
            paperTypes: "type",
        },
        parseFilter: {
            tags: parseCsvStringList,
            years: parseCsvNumberList,
            paperTypes: parseCsvStringList,
        },
    });

    const selectedTags = filters.tags;
    const selectedYears = filters.years;
    const selectedPaperTypes = filters.paperTypes;

    const allPaperIds = useMemo(() => {
        return Object.entries(papersData)
            .sort((a, b) => b[1].duration.end.getTime() - a[1].duration.end.getTime())
            .map(([id]) => id);
    }, []);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allPaperIds.forEach((id) => {
            papersData[id].tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [allPaperIds]);

    const allYears = useMemo(() => {
        const years = new Set<number>();
        allPaperIds.forEach((id) => {
            if (papersData[id].duration?.end) {
                years.add(papersData[id].duration.end.getFullYear());
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [allPaperIds]);

    const allPaperTypes = useMemo(() => {
        const types = new Set<string>();
        allPaperIds.forEach((id) => {
            if (papersData[id].paperType) {
                types.add(papersData[id].paperType);
            }
        });
        return Array.from(types).sort();
    }, [allPaperIds]);

    const paperMatchesSearch = (paper: (typeof papersData)[string]) => {
        return (
            searchQuery === "" ||
            paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const paperMatchesTags = (paper: (typeof papersData)[string], tags: string[]) => {
        return tags.length === 0 || tags.every((tag) => paper.tags?.includes(tag));
    };

    const paperMatchesYear = (paper: (typeof papersData)[string], years: number[]) => {
        return years.length === 0 || (paper.duration?.end && years.includes(paper.duration.end.getFullYear()));
    };

    const paperMatchesType = (paper: (typeof papersData)[string], types: string[]) => {
        return types.length === 0 || types.includes(paper.paperType);
    };

    const paperTagCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allPaperIds,
                values: allTags,
                selectedValues: selectedTags,
                isMatch: (id, nextTags) => {
                    const paper = papersData[id];
                    return (
                        paperMatchesSearch(paper) &&
                        paperMatchesTags(paper, nextTags) &&
                        paperMatchesYear(paper, selectedYears) &&
                        paperMatchesType(paper, selectedPaperTypes)
                    );
                },
            }),
        [allPaperIds, allTags, selectedPaperTypes, selectedTags, selectedYears, searchQuery]
    );

    const paperYearCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allPaperIds,
                values: allYears,
                selectedValues: selectedYears,
                isMatch: (id, nextYears) => {
                    const paper = papersData[id];
                    return (
                        paperMatchesSearch(paper) &&
                        paperMatchesTags(paper, selectedTags) &&
                        paperMatchesYear(paper, nextYears) &&
                        paperMatchesType(paper, selectedPaperTypes)
                    );
                },
            }),
        [allPaperIds, allYears, selectedPaperTypes, selectedTags, selectedYears, searchQuery]
    );

    const paperTypeCounts = useMemo(
        () =>
            computeFacetCounts({
                items: allPaperIds,
                values: allPaperTypes,
                selectedValues: selectedPaperTypes,
                isMatch: (id, nextTypes) => {
                    const paper = papersData[id];
                    return (
                        paperMatchesSearch(paper) &&
                        paperMatchesTags(paper, selectedTags) &&
                        paperMatchesYear(paper, selectedYears) &&
                        paperMatchesType(paper, nextTypes)
                    );
                },
            }),
        [allPaperIds, allPaperTypes, selectedPaperTypes, selectedTags, selectedYears, searchQuery]
    );

    const filteredPapers = useMemo(() => {
        return allPaperIds.filter((id) => {
            const paper = papersData[id];
            return (
                paperMatchesSearch(paper) &&
                paperMatchesTags(paper, selectedTags) &&
                paperMatchesYear(paper, selectedYears) &&
                paperMatchesType(paper, selectedPaperTypes)
            );
        });
    }, [allPaperIds, searchQuery, selectedTags, selectedYears, selectedPaperTypes]);

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleTag = (tag: string) => {
        toggleFilterValue("tags", tag);
    };

    const toggleYear = (year: number) => {
        toggleFilterValue("years", year);
    };

    const togglePaperType = (type: string) => {
        toggleFilterValue("paperTypes", type);
    };

    const selectedPaperTypeLabel = selectedPaperTypes.length === 1 ? "paper category" : "paper categories";
    const selectedThemeLabel = selectedTags.length === 1 ? "theme" : "themes";
    const selectedYearLabel = selectedYears.length === 1 ? "year" : "years";

    const summary = (
        <>
            <span className="font-medium text-accent">
                {filteredPapers.length} / {allPaperIds.length}
            </span>
            <span>{" papers found "}</span>

            {selectedPaperTypes.length > 0 && (
                <>
                    {" filtered by "}
                    <span className="text-accent">
                        {selectedPaperTypes.length} {selectedPaperTypeLabel}
                    </span>
                </>
            )}
            {selectedTags.length > 0 && (
                <>
                    {" with "}
                    <span className="text-accent">
                        {selectedTags.length} {selectedThemeLabel}
                    </span>
                </>
            )}
            {selectedYears.length > 0 && (
                <>
                    {" from the "}
                    <span className="text-accent">
                        {selectedYearLabel} {selectedYears.join(", ")}
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
                        placeholder="Search abstracts and titles..."
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
                            count={paperTagCounts[tag] ?? 0}
                            isActive={selectedTags.includes(tag)}
                            onClick={() => toggleTag(tag)}
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
                                    count={paperYearCounts[year] ?? 0}
                                    isActive={selectedYears.includes(year)}
                                    onClick={() => toggleYear(year)}
                                />
                            ))}
                        </FilterSection>
                    )}
                    {allPaperTypes.length > 0 && (
                        <FilterSection title="Paper Category Filter" icon={<TbFilterDown />} className="">
                            {allPaperTypes.map((type) => (
                                <FilterTag
                                    key={type}
                                    label={type}
                                    count={paperTypeCounts[type] ?? 0}
                                    isActive={selectedPaperTypes.includes(type)}
                                    onClick={() => togglePaperType(type)}
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
            backHref="/#papers"
            backTexts={["Back Home", "Over & Out"]}
            title="Papers & Written Records."
            titleClassName="text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] pb-8 md:pb-10 lg:pb-12 md:max-w-[80vw] mx-auto"
            summary={summary}
            isFilterVisible={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            filterPanel={filtersPanel}
            mainClassName="containerd border-t border-current"
        >
            {filteredPapers.length > 0 ? (
                <motion.div variants={fadeIn} initial="hidden" animate="visible">
                    <PaperItems expandedItems={expandedItems} toggleItem={toggleItem} paperIds={filteredPapers} />
                </motion.div>
            ) : (
                <motion.div className="text-center py-20" variants={fadeIn} initial="hidden" animate="visible">
                    <p className="mb-8 text-accent">No papers found matching your criteria!</p>
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
