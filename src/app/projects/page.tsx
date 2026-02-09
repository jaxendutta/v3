"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { googleSansFlex } from "@/lib/fonts";
import { fadeIn, staggerContainer, slideUp } from "@/lib/motionVariants";
import { projectsData } from "@/data/projects";
import RotatingButton from "@/components/ui/RotatingButton";
import { CiSearch } from "react-icons/ci";
import { GiTechnoHeart, GiCalendar } from "react-icons/gi";
import { HiOutlineArrowLongLeft, HiOutlineArrowLongUp } from "react-icons/hi2";
import ProjectCard from "@/components/sections/project/ProjectCard";
import Footer from "@/components/layout/Footer";
import FilterContainer, {
    FilterTag,
    FilterSection,
} from "@/components/ui/FilterContainer";
import { TbFilterX, TbFilterDown, TbFilterUp } from "react-icons/tb";

export default function ProjectsPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const projects = projectsData;
    const projectIds = Object.keys(projects);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>(
        searchParams.get("tech")?.split(",").filter(Boolean) || []
    );
    const [selectedYears, setSelectedYears] = useState<number[]>(
        searchParams.get("year")?.split(",").map(Number).filter(n => !isNaN(n)) || []
    );

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Create the "desired" query string based on current state
        const currentTech = selectedTechStack.join(",");
        const currentYear = selectedYears.join(",");

        // Only update params if they differ from what is currently in the URL
        let needsUpdate = false;

        if (searchQuery !== (searchParams.get("search") || "")) {
            searchQuery ? params.set("search", searchQuery) : params.delete("search");
            needsUpdate = true;
        }

        if (currentTech !== (searchParams.get("tech") || "")) {
            currentTech ? params.set("tech", currentTech) : params.delete("tech");
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
    }, [searchQuery, selectedTechStack, selectedYears, pathname, router, searchParams]);

    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setSelectedTechStack(searchParams.get("tech")?.split(",").filter(Boolean) || []);
        setSelectedYears(searchParams.get("year")?.split(",").map(Number).filter(n => !isNaN(n)) || []);
    }, [searchParams]);

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

    // Filter projects based on search query, selected tech stacks, and years
    const filteredProjects = useMemo(() => {
        return projectIds.filter((id) => {
            const project = projects[id];
            const matchesSearch =
                searchQuery === "" ||
                project.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (project.subtitle &&
                    project.subtitle
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())) ||
                (project.overview &&
                    project.overview.some((paragraph) =>
                        paragraph.some((item) =>
                            item.content
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                        )
                    ));

            const matchesTechStack =
                selectedTechStack.length === 0 ||
                (project.techStack &&
                    selectedTechStack.every(
                        (tech) =>
                            project.techStack &&
                            Object.values(project.techStack)
                                .flat()
                                .some((techObj) => techObj.name.toLowerCase() === tech.toLowerCase())
                    ));

            const matchesYear =
                selectedYears.length === 0 ||
                (project.date &&
                    selectedYears.includes(project.date.getFullYear()));

            return matchesSearch && matchesTechStack && matchesYear;
        });
    }, [projectIds, projects, searchQuery, selectedTechStack, selectedYears]);

    // Toggle tech stack selection
    const toggleTechStack = (tech: string) => {
        setSelectedTechStack((prev) =>
            prev.includes(tech)
                ? prev.filter((t) => t !== tech)
                : [...prev, tech]
        );
    };

    // Toggle year selection
    const toggleYear = (year: number) => {
        setSelectedYears((prev) =>
            prev.includes(year)
                ? prev.filter((y) => y !== year)
                : [...prev, year]
        );
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery("");
        setSelectedTechStack([]);
        setSelectedYears([]);
    };

    // Check if any filters are active
    const hasActiveFilters =
        searchQuery !== "" ||
        selectedTechStack.length > 0 ||
        selectedYears.length > 0;

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4 md:p-6 lg:p-8 xl:p-12 2xl:p-16 text-xs md:text-sm lg:text-base">
            <motion.header
                className="sticky top-4 z-50 flex justify-between items-center"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <RotatingButton
                    href="/#projects"
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

            {/* Page title and description */}
            <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className={`text-5xl md:text-7xl text-center ${googleSansFlex.className} pb-8`}
                >
                    Projects.
                </motion.div>

                {/* Results count and filter controls */}
                <div className="flex justify-between items-center gap-4 border-b border-current pb-4 ">
                    {/* Results count with detailed filter information */}
                    <div className="w-full text-center items-center justify-center flex flex-wrap">
                        <span className="whitespace-nowrap">
                            <span className="font-bold">
                                {filteredProjects.length} / {projectIds.length}
                            </span>
                            <span>{" projects found "}</span>

                            {selectedTechStack.length > 0 && (
                                <>
                                    <span>{" filtered by "}</span>
                                    <span className="text-accent">
                                        {selectedTechStack.length}{" "}
                                        {selectedTechStack.length === 1
                                            ? "tool"
                                            : "tools"}
                                    </span>
                                </>
                            )}
                            {selectedYears.length > 0 && (
                                <>
                                    {" from "}
                                    <span className="text-accent">
                                        {selectedYears.length === 1
                                            ? "year"
                                            : "years"}{" "}
                                        {selectedYears.join(", ")}
                                    </span>
                                </>
                            )}
                            {searchQuery && (
                                <>
                                    {" matching "}
                                    <span className="text-accent italic">
                                        &quot;{searchQuery}&quot;
                                    </span>
                                </>
                            )}
                        </span>
                    </div>

                    {/* Filter controls */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {hasActiveFilters && (
                            <motion.button
                                title="Clear filters"
                                onClick={clearFilters}
                                className="px-2 py-1.5 border border-current text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                                whileHover={{
                                    backgroundColor: "red",
                                    color: "white",
                                }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <TbFilterX className="flex-shrink-0" />
                                <span className="hidden md:flex">
                                    Clear filters
                                </span>
                            </motion.button>
                        )}

                        <button
                            type="button"
                            title={
                                showFilters ? "Hide filters" : "Show filters"
                            }
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-2 py-1.5 border border-current hover:bg-[var(--color-text)] hover:text-[var(--color-background)] transition-colors flex items-center gap-2 whitespace-nowrap"
                            aria-label={
                                showFilters ? "Hide filters" : "Show filters"
                            }
                        >
                            {showFilters ? (
                                <TbFilterUp className="flex-shrink-0" />
                            ) : (
                                <TbFilterDown className="flex-shrink-0" />
                            )}
                            <span className="hidden md:flex">
                                {showFilters ? "Hide filters" : "Show filters"}
                            </span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Filter section using custom FilterContainer component */}
            <FilterContainer
                isVisible={showFilters}
                className="container w-full flex"
            >
                <div className="flex flex-col gap-6">
                    {/* Search Box */}
                    <div className="w-full">
                        <div className="relative">
                            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2" />
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
                        {/* Tech Stack Filter */}
                        <FilterSection
                            title="Tech Stack Filter"
                            icon={<GiTechnoHeart />}
                            className="md:col-span-3"
                        >
                            {allTechStacks.map((tech) => (
                                <FilterTag
                                    key={tech}
                                    label={tech}
                                    isActive={selectedTechStack.includes(tech)}
                                    onClick={() => toggleTechStack(tech)}
                                />
                            ))}
                        </FilterSection>

                        {/* Year Filter */}
                        {allYears.length > 0 && (
                            <FilterSection
                                title="Year Filter"
                                icon={<GiCalendar />}
                                className="md:col-span-1"
                            >
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

            {/* Projects display */}
            <main className="containerd">
                {filteredProjects.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-5 md:space-y-8"
                    >
                        {filteredProjects.map((id, index) => (
                            <motion.div
                                key={id}
                                variants={slideUp}
                                className="p-6 border border-current"
                            >
                                <ProjectCard
                                    id={id}
                                    project={projects[id]}
                                    reversed={index % 2 !== 0}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-20"
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-2xl mb-8 opacity-70">
                            No projects found matching your criteria
                        </p>
                        <button
                            type="button"
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
