"use client";

import { AnimatePresence, motion, LayoutGroup, type Transition } from "framer-motion";
import RotatingButton from "@/components/ui/RotatingButton";
import { HiArrowLeft, HiArrowRight, HiArrowUp } from "react-icons/hi";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { headingFont } from "@/lib/fonts";
import { useParams } from "next/navigation";
import { projectsData } from "@/data/projectData";

function getAdjacentProjects(currentId: string): {
    prev: string | null;
    next: string | null;
} {
    const projectIds = Object.keys(projectsData);
    const currentIndex = projectIds.indexOf(currentId);

    const prev = currentIndex > 0 ? projectIds[currentIndex - 1] : null;
    const next =
        currentIndex !== -1 && currentIndex < projectIds.length - 1
            ? projectIds[currentIndex + 1]
            : null;

    return { prev, next };
}

interface ProjectsPageHeaderProps {
    isLandscape: boolean;
    titleVisible: boolean;
}

export default function ProjectsPageHeader({
    isLandscape,
    titleVisible,
}: ProjectsPageHeaderProps) {
    const { projectId } = useParams();
    const id = typeof projectId === "string" ? projectId : projectId?.[0] || "";
    const project = projectsData[id];
    const adjacentProjects = project ? getAdjacentProjects(id) : null;
    const mainElement =
        document.querySelector("main") || document.documentElement;

    const scrollToStart = () => {
        mainElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const scrollNext = () => {
        if (mainElement) {
            const scrollAmount = isLandscape
                ? window.innerWidth
                : window.innerHeight;
            mainElement.scrollBy({
                left: isLandscape ? scrollAmount : 0,
                top: isLandscape ? 0 : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Shared animation transition for consistency
    const springTransition: Transition = {
        type: "spring",
        stiffness: 300,
        damping: 30,
    };

    // Define animation preset types to ensure type safety
    type AnimationPreset = {
        x?: number;
        y?: number;
        scale?: number;
    };

    const animations: Record<string, AnimationPreset> = {
        fadeLeft: { x: -20 },
        fadeRight: { x: 20 },
        fadeUp: { y: -20 },
        scale: { scale: 0.8 },
    };

    // Helper function for creating motion props based on animation type
    const getMotionProps = (animationType: keyof typeof animations) => {
        const anim = animations[animationType];
        const animate = {
            opacity: 1,
            x: anim.x !== undefined ? 0 : undefined,
            y: anim.y !== undefined ? 0 : undefined,
            scale: anim.scale !== undefined ? 1 : undefined,
        };

        return {
            initial: { opacity: 0, ...anim },
            animate,
            exit: { opacity: 0, ...anim },
            transition: springTransition,
            layout: true,
        };
    };

    // Shared button properties
    const buttonProps = {
        size: 80,
        fontSize: 12,
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-3 pb-5 flex items-center bg-gradient-to-b from-background/95 to-transparent backdrop-blur-sm [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
            <LayoutGroup>
                <motion.div
                    className={`w-full flex items-center justify-between ${titleVisible && "gap-4 lg:gap-6"}`}
                    layout
                    transition={springTransition}
                >
                    {/* Back to Projects button */}
                    <motion.div {...getMotionProps("fadeLeft")}>
                        <RotatingButton
                            texts={["BACK TO", "PROJECTS PAGE"]}
                            centerIcon={HiArrowLeft}
                            {...buttonProps}
                            href="/projects"
                        />
                    </motion.div>

                    {/* Scroll Right button */}
                    <AnimatePresence mode="popLayout">
                        {isLandscape && (
                            <motion.div
                                key="scroll-next"
                                {...getMotionProps("scale")}
                            >
                                <RotatingButton
                                    texts={["SCROLL RIGHT", "SCROLL NEXT"]}
                                    centerIcon={HiArrowRight}
                                    {...buttonProps}
                                    onClick={scrollNext}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Project Title */}
                    <AnimatePresence mode="popLayout">
                        {titleVisible && isLandscape && (
                            <motion.div
                                key="project-title"
                                className={`flex-1 flex justify-center text-3xl lowercase tracking-wider ${headingFont}`}
                                style={{ fontStyle: "italic" }}
                                {...getMotionProps("fadeUp")}
                            >
                                {project.name}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Previous Project button */}
                    <AnimatePresence mode="popLayout">
                        {adjacentProjects?.prev && (
                            <motion.div
                                key="prev-project"
                                {...getMotionProps("fadeRight")}
                            >
                                <RotatingButton
                                    texts={["PREV PROJECT", "PREV PROJECT"]}
                                    centerIcon={GrChapterPrevious}
                                    {...buttonProps}
                                    href={`/projects/${adjacentProjects.prev}`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Next Project button */}
                    <AnimatePresence mode="popLayout">
                        {adjacentProjects?.next && (
                            <motion.div
                                key="next-project"
                                {...getMotionProps("fadeLeft")}
                            >
                                <RotatingButton
                                    texts={["NEXT PROJECT", "NEXT PROJECT"]}
                                    centerIcon={GrChapterNext}
                                    {...buttonProps}
                                    href={`/projects/${adjacentProjects.next}`}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Back to Start button */}
                    <motion.div {...getMotionProps("fadeRight")}>
                        <RotatingButton
                            texts={[
                                "BACK TO START",
                                isLandscape ? "LEFT OF PAGE" : "TOP OF PAGE",
                            ]}
                            centerIcon={HiArrowUp}
                            {...buttonProps}
                            onClick={scrollToStart}
                        />
                    </motion.div>
                </motion.div>
            </LayoutGroup>
        </header>
    );
}
