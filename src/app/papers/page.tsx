// src/app/papers/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { serifFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import { papersData } from "@/data/papers";
import { computeFacetCounts, parseCsvNumberList, parseCsvStringList, useSyncedFilters } from "@/lib/filtering";
import RotatingButton from "@/components/ui/RotatingButton";
import { HiOutlineArrowLongLeft, HiOutlineArrowLongUp } from "react-icons/hi2";
import { PaperItems } from "@/components/sections/papers/PaperItem";
import Footer from "@/components/layout/Footer";
import FilterContainer, {
    FilterTag,
    FilterSection,
} from "@/components/ui/FilterContainer";
import { TbFilterX, TbFilterDown, TbFilterUp } from "react-icons/tb";
import { LuCalendarRange, LuSearch, LuSwatchBook } from "react-icons/lu";

export default function PapersPage() {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [showFilters, setShowFilters] = useState(false);
    const {
        searchQuery,
        setSearchQuery,
        filters,
        toggleFilterValue,
        clearFilters,
        hasActiveFilters,
    } = useSyncedFilters<{
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

    // Chronologically sorted IDs
    const allPaperIds = useMemo(() => {
        return Object.entries(papersData)
            .sort((a, b) => b[1].duration.end.getTime() - a[1].duration.end.getTime())
            .map(([id]) => id);
    }, []);

    // Extract all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        allPaperIds.forEach((id) => {
            papersData[id].tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [allPaperIds]);

    // Extract all unique years
    const allYears = useMemo(() => {
        const years = new Set<number>();
        allPaperIds.forEach((id) => {
            if (papersData[id].duration?.end) {
                years.add(papersData[id].duration.end.getFullYear());
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, [allPaperIds]);

    // Extract all unique paper types
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

    // Filter projects 
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

    const selectedPaperTypeLabel =
        selectedPaperTypes.length === 1 ? "paper category" : "paper categories";
    const selectedThemeLabel = selectedTags.length === 1 ? "theme" : "themes";
    const selectedYearLabel = selectedYears.length === 1 ? "year" : "years";

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-16 text-[13px] md:text-sm lg:text-base">
            <motion.header
                className="sticky top-4 z-50 flex justify-between items-center"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <RotatingButton
                    href="/#papers"
                    texts={["Back Home", "Over & Out"]}
                    centerIcon={HiOutlineArrowLongLeft}
                    size={80}
                    fontSize={12}
                    variant="glow"
                />
                <RotatingButton
                    href="#top"
                    texts={["Back to top", "Scroll up"]}
                    centerIcon={HiOutlineArrowLongUp}
                    size={80}
                    fontSize={12}
                    variant="glow"
                />
            </motion.header>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="w-full">
                <motion.div className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center ${serifFont} italic leading-[1.15] pb-8 md:pb-10 lg:pb-12 md:max-w-[80vw] mx-auto`}>
                    Papers & Written Records.
                </motion.div>

                <div className="flex justify-between items-center gap-4 md:gap-8 border-b border-current pb-4">
                    <div className="w-full min-w-0 text-center items-center text-[13px] leading-[1] justify-center flex flex-wrap">
                        <span className="max-w-full break-words text-left leading-relaxed">
                            <span className="font-semibold">
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
                        </span>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        {hasActiveFilters && (
                            <motion.button
                                onClick={clearFilters}
                                className="px-2 py-1.5 border border-current text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                                whileHover={{ backgroundColor: "red", color: "white" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <TbFilterX className="flex-shrink-0" />
                                <span className="hidden md:flex">Clear filters</span>
                            </motion.button>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-2 py-1.5 border border-current hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                            {showFilters ? <TbFilterUp /> : <TbFilterDown />}
                            <span className="hidden md:flex">{showFilters ? "Hide filters" : "Show filters"}</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <FilterContainer isVisible={showFilters} className="container w-full flex self-center">
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
                    <div className="w-full flex flex-col md:grid md:grid-cols-4 md:gap-4 gap-8">
                        <FilterSection title="Theme Filter" icon={<LuSwatchBook />} className="md:col-span-3">
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
                        <div className="flex flex-col gap-4 md:gap-0 md:flex-col md:col-span-1">
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
            </FilterContainer>

            <main className="containerd border-t border-current">
                {filteredPapers.length > 0 ? (
                    <motion.div variants={fadeIn} initial="hidden" animate="visible">
                        <PaperItems
                            expandedItems={expandedItems}
                            toggleItem={toggleItem}
                            paperIds={filteredPapers}
                        />
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
            </main>
            <Footer className="mt-6" />
        </div>
    );
}
