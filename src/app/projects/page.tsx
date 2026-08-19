"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp } from "@/lib/motionVariants";
import { projectsData } from "@/data/projects";
import { computeFacetCounts, parseCsvNumberList, parseCsvStringList, useSyncedFilters } from "@/lib/filtering";
import { LuSearch, LuSwatchBook, LuCalendarRange, LuLayers } from "react-icons/lu";
import ProjectCard from "@/components/sections/project/ProjectCard";
import FilteredCollectionPage from "@/components/layout/FilteredCollectionPage";
import {
    FilterTag,
    FilterSection,
} from "@/components/ui/FilterContainer";

import { CATEGORY_MAP, ProjectCategoryKey } from "@/types/project";

export default function ProjectsPage() {
    const projects = projectsData;
    const projectIds = Object.keys(projects);
    const [showFilters, setShowFilters] = useState(false);
    const {
        searchQuery,
        setSearchQuery,
        filters,
        toggleFilterValue,
        clearFilters,
        hasActiveFilters,
    } = useSyncedFilters<{
        techStack: string[];
        years: number[];
        categories: string[];
    }>({
        filterParams: {
            techStack: "tech",
            years: "year",
            categories: "cat",
        },
        parseFilter: {
            techStack: parseCsvStringList,
            years: parseCsvNumberList,
            categories: parseCsvStringList,
        },
    });

    const selectedTechStack = filters.techStack;
    const selectedYears = filters.years;
    const selectedCategories = filters.categories;

    const allCategories = useMemo(() => {
        return Object.keys(CATEGORY_MAP) as ProjectCategoryKey[];
    }, []);

    // Extract all unique tech stacks from all projects
    const allTechStacks = useMemo(() => {
        const techStacks = new Set<string>();

        projectIds.forEach((id) => {
            const project = projects[id];
            if (project.techStack) {
                Object.values(project.techStack)
                    .flat()
                    .forEach((tech) => {
                        techStacks.add(tech.name);
                    });
            }
        });

        return Array.from(techStacks).sort();
    }, [projectIds, projects]);

    // Extract all unique years from project data (including active range spans)
    const allYears = useMemo(() => {
        const years = new Set<number>();

        projectIds.forEach((id) => {
            const project = projects[id];
            if (project.date) {
                const startYear = project.date.start.getFullYear();
                const endYear = (project.date.end ?? new Date()).getFullYear();
                for (let y = startYear; y <= endYear; y++) {
                    years.add(y);
                }
            }
        });

        return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
    }, [projectIds, projects]);

    const projectMatchesSearch = (project: (typeof projectsData)[string]) => {
        return (
            searchQuery === "" ||
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (project.overview?.some((paragraph) =>
                paragraph.some((item) => item.content.toLowerCase().includes(searchQuery.toLowerCase()))
            ) ?? false)
        );
    };

    const projectMatchesTechStack = (project: (typeof projectsData)[string], techStack: string[]) => {
        if (techStack.length === 0) {
            return true;
        }

        if (!project.techStack) {
            return false;
        }

        const projectTechStack = project.techStack;

        return techStack.every((tech) =>
            Object.values(projectTechStack)
                .flat()
                .some((techObj) => techObj.name.toLowerCase() === tech.toLowerCase())
        );
    };

    const projectMatchesYear = (project: (typeof projectsData)[string], years: number[]) => {
        if (years.length === 0) return true;
        if (!project.date) return false;
        const startYear = project.date.start.getFullYear();
        const endYear = (project.date.end ?? new Date()).getFullYear();
        return years.some((year) => year >= startYear && year <= endYear);
    };

    const projectMatchesCategory = (project: (typeof projectsData)[string], categories: string[]) => {
        return (
            categories.length === 0 ||
            (project.categories
                ? categories.some((cat) => project.categories.includes(cat as ProjectCategoryKey))
                : false)
        );
    };

    const categoryCounts = useMemo(
        () =>
            computeFacetCounts({
                items: projectIds,
                values: allCategories,
                selectedValues: selectedCategories,
                isMatch: (id, nextCategories) => {
                    const project = projects[id];
                    return (
                        projectMatchesSearch(project) &&
                        projectMatchesTechStack(project, selectedTechStack) &&
                        projectMatchesYear(project, selectedYears) &&
                        projectMatchesCategory(project, nextCategories)
                    );
                },
            }),
        [allCategories, projectIds, selectedCategories, selectedTechStack, selectedYears, searchQuery]
    );

    const techStackCounts = useMemo(
        () =>
            computeFacetCounts({
                items: projectIds,
                values: allTechStacks,
                selectedValues: selectedTechStack,
                isMatch: (id, nextTechStack) => {
                    const project = projects[id];
                    return (
                        projectMatchesSearch(project) &&
                        projectMatchesTechStack(project, nextTechStack) &&
                        projectMatchesYear(project, selectedYears) &&
                        projectMatchesCategory(project, selectedCategories)
                    );
                },
            }),
        [allTechStacks, projectIds, selectedTechStack, selectedYears, selectedCategories, searchQuery]
    );

    const yearCounts = useMemo(
        () =>
            computeFacetCounts({
                items: projectIds,
                values: allYears,
                selectedValues: selectedYears,
                isMatch: (id, nextYears) => {
                    const project = projects[id];
                    return (
                        projectMatchesSearch(project) &&
                        projectMatchesTechStack(project, selectedTechStack) &&
                        projectMatchesYear(project, nextYears) &&
                        projectMatchesCategory(project, selectedCategories)
                    );
                },
            }),
        [allYears, projectIds, selectedTechStack, selectedYears, selectedCategories, searchQuery]
    );

    // Filter projects based on search query, selected tech stacks, years, and categories
    const filteredProjects = useMemo(() => {
        return projectIds.filter((id) => {
            const project = projects[id];
            return (
                projectMatchesSearch(project) &&
                projectMatchesTechStack(project, selectedTechStack) &&
                projectMatchesYear(project, selectedYears) &&
                projectMatchesCategory(project, selectedCategories)
            );
        });
    }, [projectIds, projects, searchQuery, selectedTechStack, selectedYears, selectedCategories]);

    const toggleTechStack = (tech: string) => {
        toggleFilterValue("techStack", tech);
    };

    const toggleYear = (year: number) => {
        toggleFilterValue("years", year);
    };

    const toggleCategory = (cat: string) => {
        toggleFilterValue("categories", cat);
    };

    const summary = (
        <>
            <span className="font-medium text-accent">
                {filteredProjects.length} / {projectIds.length}
            </span>
            <span>{" projects found "}</span>

            {selectedCategories.length > 0 && (
                <>
                    <span>{" in "}</span>
                    <span className="text-accent">
                        {selectedCategories
                            .map((cat) => CATEGORY_MAP[cat as ProjectCategoryKey] ?? cat)
                            .join(", ")}
                    </span>
                </>
            )}
            {selectedTechStack.length > 0 && (
                <>
                    <span>{" using "}</span>
                    <span className="text-accent">
                        {selectedTechStack.length} {selectedTechStack.length === 1 ? "tool" : "tools"}
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
        </>
    );

    const filtersPanel = (
        <div className="flex flex-col gap-6">
            <div className="w-full">
                <div className="relative">
                    <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-8 pr-4 border border-current bg-transparent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>
            </div>

            <div className="w-full flex flex-col gap-6">
                <FilterSection title="Industry / Category" icon={<LuLayers />}>
                    {allCategories.map((catKey) => (
                        <FilterTag
                            key={catKey}
                            label={CATEGORY_MAP[catKey]}
                            count={categoryCounts[catKey] ?? 0}
                            isActive={selectedCategories.includes(catKey)}
                            onClick={() => toggleCategory(catKey)}
                        />
                    ))}
                </FilterSection>

                <div className="w-full flex flex-col md:grid md:grid-cols-4 md:gap-4 gap-8">
                    <FilterSection title="Tech Stack" icon={<LuSwatchBook />} className="md:col-span-3">
                        {allTechStacks.map((tech) => (
                            <FilterTag
                                key={tech}
                                label={tech}
                                count={techStackCounts[tech] ?? 0}
                                isActive={selectedTechStack.includes(tech)}
                                onClick={() => toggleTechStack(tech)}
                            />
                        ))}
                    </FilterSection>

                    {allYears.length > 0 && (
                        <FilterSection title="Year" icon={<LuCalendarRange />} className="md:col-span-1">
                            {allYears.map((year) => (
                                <FilterTag
                                    key={year}
                                    label={year.toString()}
                                    count={yearCounts[year] ?? 0}
                                    isActive={selectedYears.includes(year)}
                                    onClick={() => toggleYear(year)}
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
            backHref="/#projects"
            backTexts={["Back Home", "Over & Out"]}
            title="Projects"
            titleClassName="text-7xl md:text-[10rem] pb-8 md:pb-10 lg:pb-12"
            summary={summary}
            isFilterVisible={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            filterPanel={filtersPanel}
            mainClassName="containerd"
        >
            {filteredProjects.length > 0 ? (
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5 md:space-y-8">
                    {filteredProjects.map((id, index) => (
                        <motion.div key={id} variants={slideUp} className="p-6 border border-current">
                            <ProjectCard id={id} project={projects[id]} reversed={index % 2 !== 0} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div className="text-center py-20" variants={fadeIn} initial="hidden" animate="visible">
                    <p className="mb-8 text-accent">No projects found matching your criteria!</p>
                    <button
                        type="button"
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
