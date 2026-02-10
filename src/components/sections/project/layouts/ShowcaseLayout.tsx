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

export default function ShowcaseLayout({ projectId }: { projectId: string }) {
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

    // --- MODERN SMOOTH HORIZONTAL SCROLL LOGIC ---
    useEffect(() => {
        if (!isLandscape || !mainRef.current) return;
        const mainElement = mainRef.current;

        // Physics State
        let targetScroll = mainElement.scrollLeft;
        let currentScroll = mainElement.scrollLeft;
        let isAnimating = false;
        let animationFrameId: number;

        const updateScroll = () => {
            if (!mainElement) return;

            // 1. Lerp: Move current towards target by a percentage (0.08 = 8% per frame)
            // Adjust 0.08 for "weight". Lower = heavier/smoother, Higher = snappier.
            currentScroll = lerp(currentScroll, targetScroll, 0.08);

            // 2. Apply scroll
            mainElement.scrollLeft = currentScroll;

            // 3. Stop if we are close enough (sub-pixel precision)
            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                animationFrameId = requestAnimationFrame(updateScroll);
            } else {
                isAnimating = false;
                // Snap to exact target to ensure clean rendering
                mainElement.scrollLeft = targetScroll;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            // A. Detect Horizontal Trackpad Swipes
            // If deltaX is dominant, the user is likely swiping sideways on a trackpad.
            // Let the browser handle this natively for the best feel.
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                // Update our trackers so they don't lag behind the native scroll
                targetScroll = mainElement.scrollLeft;
                currentScroll = mainElement.scrollLeft;
                return;
            }

            // B. Handle Vertical Wheel (Mouse / Trackpad Vertical)
            e.preventDefault();

            // Accumulate the delta into our target
            // Multiplier (e.g. 1.2) can be added here if you want faster scrolling
            targetScroll += e.deltaY;

            // Clamp the target so we don't scroll past the content
            const maxScroll = mainElement.scrollWidth - mainElement.clientWidth;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

            // Start the animation loop if it's not running
            if (!isAnimating) {
                isAnimating = true;
                // Sync currentScroll in case the user dragged the scrollbar manually
                currentScroll = mainElement.scrollLeft;
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updateScroll);
            }
        };

        // { passive: false } is required to use e.preventDefault()
        mainElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            mainElement.removeEventListener("wheel", handleWheel);
            cancelAnimationFrame(animationFrameId);
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
        // Use standard scroll event listener since we are updating scrollLeft property
        const handleScroll = () => requestAnimationFrame(updateHeaderVisibility);

        mainRef.current?.addEventListener("scroll", handleScroll);
        return () => mainRef.current?.removeEventListener("scroll", handleScroll);
    }, [isLandscape]);

    return (
        <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={isLandscape} />

            <main
                ref={mainRef}
                className={`
                    h-screen w-screen no-scrollbar flex scroll-pt-[100px] pt-[100px]
                    ${isLandscape
                        ? "flex-row gap-20 overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
                        : "flex-col overflow-y-auto overflow-x-hidden pb-40"
                    }
                `}
            >
                <NameSection
                    name={project.name}
                    className={
                        isLandscape
                            ? "min-w-full w-fit snap-start shrink-0 h-full"
                            : "w-full h-fit min-h-[calc(100vh-100px)] snap-start shrink-0"
                    }
                />

                {project.overview && <OverviewSection overview={project.overview} links={project.links} isLandscape={isLandscape} />}
                {project.typography && <TypographySection typography={project.typography} />}
                {project.colors && <ColorSection colors={project.colors} />}
                {project.techStack && <TechStackSection techStack={project.techStack} />}
                {project.footer && <FooterSection footer={project.footer} />}
            </main>
        </div>
    );
}
