"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { projectsData } from "@/data/projects";
import NameSection from "@/components/sections/project/sections/NameSection";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Skeleton from "@/components/ui/Skeleton";

// Dynamic imports
const OverviewSection = dynamic(() => import("@/components/sections/project/sections/OverviewSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const TypographySection = dynamic(() => import("@/components/sections/project/sections/TypographySection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const ColorSection = dynamic(() => import("@/components/sections/project/sections/ColorSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const TechStackSection = dynamic(() => import("@/components/sections/project/sections/TechStackSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const FooterSection = dynamic(() => import("@/components/sections/project/sections/FooterSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });

// Utility for smooth animation
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

export default function ShowcaseLayout({ projectId }: { projectId: keyof typeof projectsData }) {
    const project = projectsData[projectId];
    if (!project) return null;

    const mainRef = useRef<HTMLElement>(null);
    const [titleVisible, setTitleVisible] = useState(false);
    const [isLandscape, setIsLandscape] = useState(true);

    // Window size hook
    useEffect(() => {
        const handleResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // --- UNIFIED SMOOTH SCROLL & SNAP LOGIC ---
    useEffect(() => {
        if (!mainRef.current) return;
        const mainElement = mainRef.current;

        // 1. Helpers
        const getScroll = () => isLandscape ? mainElement.scrollLeft : mainElement.scrollTop;
        const setScroll = (val: number) => isLandscape ? (mainElement.scrollLeft = val) : (mainElement.scrollTop = val);
        const getSectionPos = (el: HTMLElement) => isLandscape ? el.offsetLeft : el.offsetTop;
        const getMaxScroll = () => isLandscape
            ? mainElement.scrollWidth - mainElement.clientWidth
            : mainElement.scrollHeight - mainElement.clientHeight;

        // Physics State
        let targetScroll = getScroll();
        let currentScroll = getScroll();
        let isAnimating = false;
        let animationFrameId: number;
        let snapTimeout: NodeJS.Timeout;
        // Extra "gravity" (px) keeping scroll within a multi-point section's
        // own items rather than bleeding into an adjacent section - see
        // snapToNearestSection below.
        const STICKY_BIAS = 220;

        const updateScroll = () => {
            if (!mainElement) return;

            // Lerp current towards target
            currentScroll = lerp(currentScroll, targetScroll, 0.08);
            setScroll(currentScroll);

            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                animationFrameId = requestAnimationFrame(updateScroll);
            } else {
                isAnimating = false;
                setScroll(targetScroll);
            }
        };

        const startAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                currentScroll = getScroll();
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updateScroll);
            }
        };

        const snapToNearestSection = () => {
            if (!mainElement) return;

            const sections = Array.from(mainElement.children) as HTMLElement[];

            // Define offset: In portrait, we want to snap BELOW the 100px header.
            // In landscape, we snap to 0 (left edge).
            const snapOffset = isLandscape ? 0 : 100;

            // Guard against the NameSection free-scroll zone using each
            // section's own start position only (not sub-points below).
            let closestSection = sections[0];
            let minSectionDistance = Infinity;
            sections.forEach((section) => {
                const idealScroll = getSectionPos(section) - snapOffset;
                const distance = Math.abs(idealScroll - targetScroll);
                if (distance < minSectionDistance) {
                    minSectionDistance = distance;
                    closestSection = section;
                }
            });
            if (closestSection && closestSection.id === "project-name") {
                return;
            }

            // A section can widen/heighten itself past one viewport and
            // declare extra internal snap points via data-snap-points (a
            // JSON array of pixel offsets from its own start) - e.g. a
            // "pinned" section that scrubs through several items as you
            // scroll through its extra length. Snapping considers every
            // section's start plus any such sub-points, and settles on
            // whichever is nearest overall.
            //
            // A multi-point section's OWN nearest sub-point gets a distance
            // discount when compared globally - so scrolling among a
            // section's own items (e.g. its last item, which is right next
            // to where the following section starts) stays decisively
            // "inside" that section instead of bleeding into the next one on
            // the same scroll. Picking between a section's own points stays
            // undiscounted, so a hard scroll can still power through several
            // of them - only *leaving* the section gets the extra resistance.
            let bestScroll = closestSection ? getSectionPos(closestSection) - snapOffset : 0;
            let minDistance = Infinity;
            sections.forEach((section) => {
                const base = getSectionPos(section);
                const offsets = [0];
                const raw = section.dataset.snapPoints;
                if (raw) {
                    try {
                        (JSON.parse(raw) as number[]).forEach((offset) => offsets.push(offset));
                    } catch {
                        // ignore malformed data
                    }
                }

                let sectionBestScroll = base - snapOffset;
                let sectionBestDistance = Infinity;
                offsets.forEach((offset) => {
                    const idealScroll = base + offset - snapOffset;
                    const distance = Math.abs(idealScroll - targetScroll);
                    if (distance < sectionBestDistance) {
                        sectionBestDistance = distance;
                        sectionBestScroll = idealScroll;
                    }
                });

                const effectiveDistance = offsets.length > 1
                    ? Math.max(0, sectionBestDistance - STICKY_BIAS)
                    : sectionBestDistance;

                if (effectiveDistance < minDistance) {
                    minDistance = effectiveDistance;
                    bestScroll = sectionBestScroll;
                }
            });

            // Clamp (e.g. don't scroll above 0)
            targetScroll = Math.max(0, Math.min(bestScroll, getMaxScroll()));
            startAnimation();
        };

        const handleWheel = (e: WheelEvent) => {
            // Check for cross-axis swipe (Back/Forward gestures)
            if (!isLandscape && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return;
            }

            e.preventDefault();
            clearTimeout(snapTimeout);

            targetScroll += e.deltaY;
            targetScroll = Math.max(0, Math.min(targetScroll, getMaxScroll()));

            startAnimation();

            snapTimeout = setTimeout(snapToNearestSection, 150);
        };

        mainElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            mainElement.removeEventListener("wheel", handleWheel);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(snapTimeout);
        };
    }, [isLandscape]);

    // Header visibility logic
    useEffect(() => {
        const updateHeaderVisibility = () => {
            const section = document.getElementById("project-name");
            if (section) {
                const rect = section.getBoundingClientRect();
                setTitleVisible(isLandscape && rect.right <= 10);
            }
        };
        const handleScroll = () => requestAnimationFrame(updateHeaderVisibility);

        mainRef.current?.addEventListener("scroll", handleScroll);
        return () => mainRef.current?.removeEventListener("scroll", handleScroll);
    }, [isLandscape]);

    return (
        <div className="h-full w-screen overflow-hidden relative text-foreground flex flex-col">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={isLandscape} />

            <main
                ref={mainRef}
                className={`
                    h-screen w-screen no-scrollbar flex scroll-pt-25 pt-25
                    ${isLandscape
                        ? "flex-row gap-20 overflow-x-auto overflow-y-hidden"
                        : "flex-col overflow-y-auto overflow-x-hidden"
                    }
                `}
            >
                <NameSection project={project} projectId={projectId} />
                {project.overview && <OverviewSection projectId={projectId} overview={project.overview} links={project.links} isLandscape={isLandscape} />}
                {project.typography && <TypographySection typography={project.typography} isLandscape={isLandscape} />}
                {project.colors && <ColorSection colors={project.colors} />}
                {project.techStack && <TechStackSection techStack={project.techStack} />}
                {project.footer && <FooterSection footer={project.footer} />}
            </main>
        </div>
    );
}
