// src/app/papers/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { serifFont } from "@/lib/fonts";
import { fadeIn } from "@/lib/motionVariants";
import { papersData } from "@/data/papers";
import RotatingButton from "@/components/ui/RotatingButton";
import { CiSearch } from "react-icons/ci";
import { GiBookmark, GiCalendar } from "react-icons/gi";
import { HiOutlineArrowLongLeft, HiOutlineArrowLongUp } from "react-icons/hi2";
import { PaperItems } from "@/components/sections/papers/PaperItem";
import Footer from "@/components/layout/Footer";
import FilterContainer, {
    FilterTag,
    FilterSection,
} from "@/components/ui/FilterContainer";
import { TbFilterX, TbFilterDown, TbFilterUp } from "react-icons/tb";

export default function PapersPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedTags, setSelectedTags] = useState<string[]>(
        searchParams.get("tag")?.split(",").filter(Boolean) || []
    );
    const [selectedYears, setSelectedYears] = useState<number[]>(
        searchParams.get("year")?.split(",").map(Number).filter(n => !isNaN(n)) || []
    );

    // Sync state to URL 
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const currentTag = selectedTags.join(",");
        const currentYear = selectedYears.join(",");
        let needsUpdate = false;

        if (searchQuery !== (searchParams.get("search") || "")) {
            searchQuery ? params.set("search", searchQuery) : params.delete("search");
            needsUpdate = true;
        }
        if (currentTag !== (searchParams.get("tag") || "")) {
            currentTag ? params.set("tag", currentTag) : params.delete("tag");
            needsUpdate = true;
        }
        if (currentYear !== (searchParams.get("year") || "")) {
            currentYear ? params.set("year", currentYear) : params.delete("year");
            needsUpdate = true;
        }
        if (needsUpdate) {
            const newQuery = params.toString();
            const url = newQuery ? `${pathname}?${newQuery}` : pathname;
            router.replace(url, { scroll: false });
        }
    }, [searchQuery, selectedTags, selectedYears, pathname, router, searchParams]);

    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setSelectedTags(searchParams.get("tag")?.split(",").filter(Boolean) || []);
        setSelectedYears(searchParams.get("year")?.split(",").map(Number).filter(n => !isNaN(n)) || []);
    }, [searchParams]);

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

    // Filter projects 
    const filteredPapers = useMemo(() => {
        return allPaperIds.filter((id) => {
            const paper = papersData[id];
            const matchesSearch =
                searchQuery === "" ||
                paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTags =
                selectedTags.length === 0 ||
                selectedTags.every((t) => paper.tags?.includes(t));

            const matchesYear =
                selectedYears.length === 0 ||
                (paper.duration?.end && selectedYears.includes(paper.duration.end.getFullYear()));

            return matchesSearch && matchesTags && matchesYear;
        });
    }, [allPaperIds, searchQuery, selectedTags, selectedYears]);

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const toggleYear = (year: number) => {
        setSelectedYears((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTags([]);
        setSelectedYears([]);
    };

    const hasActiveFilters = searchQuery !== "" || selectedTags.length > 0 || selectedYears.length > 0;

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

            <motion.div variants={fadeIn} initial="hidden" animate="visible">
                <motion.div className={`text-5xl md:text-7xl text-center ${serifFont} italic pb-8 md:pb-10 lg:pb-12`}>
                    Research.
                </motion.div>

                <div className="flex justify-between items-center gap-4 border-b border-current pb-4">
                    <div className="w-full text-center items-center justify-center flex flex-wrap">
                        <span className="whitespace-nowrap">
                            <span className="font-semibold">
                                {filteredPapers.length} / {allPaperIds.length}
                            </span>
                            <span>{" papers found "}</span>

                            {selectedTags.length > 0 && (
                                <>
                                    <span>{" filtered by "}</span>
                                    <span className="text-accent">
                                        {selectedTags.length} {selectedTags.length === 1 ? "tag" : "tags"}
                                    </span>
                                </>
                            )}
                            {selectedYears.length > 0 && (
                                <>
                                    {" from "}
                                    <span className="text-accent">
                                        {selectedYears.length === 1 ? "year" : "years"} {selectedYears.join(", ")}
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

                    <div className="flex items-center gap-2 md:gap-4">
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
                            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
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
                        <FilterSection title="Topic Tag Filter" icon={<GiBookmark />} className="md:col-span-3">
                            {allTags.map((tag) => (
                                <FilterTag
                                    key={tag}
                                    label={tag}
                                    isActive={selectedTags.includes(tag)}
                                    onClick={() => toggleTag(tag)}
                                />
                            ))}
                        </FilterSection>
                        {allYears.length > 0 && (
                            <FilterSection title="Year Filter" icon={<GiCalendar />} className="md:col-span-1">
                                {allYears.map((year) => (
                                    <FilterTag
                                        key={year}
                                        label={year.toString()}
                                        isActive={selectedYears.includes(year)}
                                        onClick={() => toggleYear(year)}
                                    />
                                ))}
                            </FilterSection>
                        )}
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
