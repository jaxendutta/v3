"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer, slideUp } from "@/lib/motionVariants";
import { projectsData } from "@/data/projects";
import { computeFacetCounts, parseCsvNumberList, parseCsvStringList, useSyncedFilters } from "@/lib/filtering";
import { LuSearch, LuSwatchBook, LuCalendarRange } from "react-icons/lu";
import ProjectCard from "@/components/sections/project/ProjectCard";
import FilteredCollectionPage from "@/components/layout/FilteredCollectionPage";
import {
    FilterTag,
    FilterSection,
} from "@/components/ui/FilterContainer";

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
    }>({
        filterParams: {
            techStack: "tech",
            years: "year",
        },
        parseFilter: {
            techStack: parseCsvStringList,
            years: parseCsvNumberList,
        },
    });

    const selectedTechStack = filters.techStack;
    const selectedYears = filters.years;

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

    // Extract all unique years from project data
    const allYears = useMemo(() => {
        const years = new Set<number>();

        projectIds.forEach((id) => {
            const project = projects[id];
            if (project.date) {
                years.add(project.date.getFullYear());
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
        return years.length === 0 || years.includes(project.date.getFullYear());
    };

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
                        projectMatchesYear(project, selectedYears)
                    );
                },
            }),
        [allTechStacks, projectIds, selectedTechStack, selectedYears, searchQuery]
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
                        projectMatchesYear(project, nextYears)
                    );
                },
            }),
        [allYears, projectIds, selectedTechStack, selectedYears, searchQuery]
    );

    // Filter projects based on search query, selected tech stacks, and years
    const filteredProjects = useMemo(() => {
        return projectIds.filter((id) => {
            const project = projects[id];
            return (
                projectMatchesSearch(project) &&
                projectMatchesTechStack(project, selectedTechStack) &&
                projectMatchesYear(project, selectedYears)
            );
        });
    }, [projectIds, projects, searchQuery, selectedTechStack, selectedYears]);

    const toggleTechStack = (tech: string) => {
        toggleFilterValue("techStack", tech);
    };

    const toggleYear = (year: number) => {
        toggleFilterValue("years", year);
    };

    const summary = (
        <>
            <span className="font-semibold">
                {filteredProjects.length} / {projectIds.length}
            </span>
            <span>{" projects found "}</span>

            {selectedTechStack.length > 0 && (
                <>
                    <span>{" filtered by "}</span>
                    <span className="text-accent">
                        {selectedTechStack.length} {selectedTechStack.length === 1 ? "tool" : "tools"}
                    </span>
                </>
            )}
            {selectedYears.length > 0 && (
                <>
                    {" from the "}
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

            <div className="w-full flex flex-col md:grid md:grid-cols-4 md:gap-4 gap-8">
                <FilterSection title="Tech Stack Filter" icon={<LuSwatchBook />} className="md:col-span-3">
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
                    <FilterSection title="Year Filter" icon={<LuCalendarRange />} className="md:col-span-1">
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
    );

    return (
        <FilteredCollectionPage
            backHref="/#projects"
            backTexts={["Back Home", "Over & Out"]}
            title="Projects."
            titleClassName="text-5xl md:text-7xl pb-8 md:pb-10 lg:pb-12"
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
