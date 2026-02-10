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

    // --- SMOOTH SCROLL & SNAP LOGIC ---
    useEffect(() => {
        if (!isLandscape || !mainRef.current) return;
        const mainElement = mainRef.current;

        // Physics State
        let targetScroll = mainElement.scrollLeft;
        let currentScroll = mainElement.scrollLeft;
        let isAnimating = false;
        let animationFrameId: number;
        let snapTimeout: NodeJS.Timeout;

        // 1. The Animation Loop
        const updateScroll = () => {
            if (!mainElement) return;

            // Lerp current towards target (Smooth dampening)
            currentScroll = lerp(currentScroll, targetScroll, 0.08);
            mainElement.scrollLeft = currentScroll;

            // Continue loop if we haven't reached the target
            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                animationFrameId = requestAnimationFrame(updateScroll);
            } else {
                isAnimating = false;
                mainElement.scrollLeft = targetScroll; // Snap to exact pixel at end
            }
        };

        const startAnimation = () => {
            if (!isAnimating) {
                isAnimating = true;
                // Resync current in case native scroll happened (e.g. browser resize)
                currentScroll = mainElement.scrollLeft;
                cancelAnimationFrame(animationFrameId);
                animationFrameId = requestAnimationFrame(updateScroll);
            }
        };

        // 2. Soft Snap Logic
        const snapToNearestSection = () => {
            if (!mainElement) return;

            // Find the child section closest to where the user "threw" the scroll (targetScroll)
            const sections = Array.from(mainElement.children) as HTMLElement[];
            let closestSection = sections[0];
            let minDistance = Infinity;

            sections.forEach((section) => {
                // Calculate distance from the section's start to the current target
                const distance = Math.abs(section.offsetLeft - targetScroll);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = section;
                }
            });

            // Update target to the section's exact start position
            if (closestSection) {
                targetScroll = closestSection.offsetLeft;
                startAnimation(); // Restart loop to glide to the snap point
            }
        };

        // 3. Wheel Handler
        const handleWheel = (e: WheelEvent) => {
            // Check for horizontal touchpad swipe (Let native browser handle it)
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                targetScroll = mainElement.scrollLeft;
                currentScroll = mainElement.scrollLeft;
                return;
            }

            e.preventDefault();

            // Clear pending snap while user is actively scrolling
            clearTimeout(snapTimeout);

            // Update target
            targetScroll += e.deltaY;
            const maxScroll = mainElement.scrollWidth - mainElement.clientWidth;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

            startAnimation();

            // Schedule snap for when scrolling stops (150ms pause)
            snapTimeout = setTimeout(snapToNearestSection, 150);
        };

        // Add Listeners
        mainElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            mainElement.removeEventListener("wheel", handleWheel);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(snapTimeout);
        };
    }, [isLandscape]);

    // Header visibility
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
        <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={isLandscape} />

            <main
                ref={mainRef}
                className={`
                    h-screen w-screen no-scrollbar flex scroll-pt-[100px] pt-[100px]
                    ${isLandscape
                        // Landscape: NO snap-x and snap-mandatory.
                        // We keep overflow-x-auto so native touchpad swipes still work.
                        ? "flex-row gap-20 overflow-x-auto overflow-y-hidden"
                        : "flex-col overflow-y-auto overflow-x-hidden pb-40"
                    }
                `}
            >
                <NameSection
                    name={project.name}
                    className={
                        isLandscape
                            // Landscape: NO snap-start
                            ? "min-w-full w-fit shrink-0 h-full"
                            // Portrait: Native scrolling, so we keep snap-start
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
