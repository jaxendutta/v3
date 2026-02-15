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
            let closestSection = sections[0];
            let minDistance = Infinity;

            // Define offset: In portrait, we want to snap BELOW the 100px header.
            // In landscape, we snap to 0 (left edge).
            const snapOffset = isLandscape ? 0 : 100;

            sections.forEach((section) => {
                // Calculate ideal scroll position: Section Start - Header Height
                const idealScroll = getSectionPos(section) - snapOffset;

                // Compare distance to our CURRENT target
                const distance = Math.abs(idealScroll - targetScroll);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestSection = section;
                }
            });

            // If the closest section is the NameSection, abort the snap!
            // This turns the entire NameSection into a "free-scroll" zone.
            if (closestSection && closestSection.id === "project-name") {
                return;
            }

            if (closestSection) {
                // Update target to the ideal position
                targetScroll = getSectionPos(closestSection) - snapOffset;

                // Clamp (e.g. don't scroll above 0)
                targetScroll = Math.max(0, Math.min(targetScroll, getMaxScroll()));

                startAnimation();
            }
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
        <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground flex flex-col">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={isLandscape} />

            <main
                ref={mainRef}
                className={`
                    h-full w-screen no-scrollbar flex scroll-pt-[100px] pt-[100px]
                    ${isLandscape
                        ? "flex-row gap-20 overflow-x-auto overflow-y-hidden"
                        : "flex-col overflow-y-auto overflow-x-hidden"
                    }
                `}
            >
                <NameSection name={project.name} />
                {project.overview && <OverviewSection overview={project.overview} links={project.links} isLandscape={isLandscape} />}
                {project.typography && <TypographySection typography={project.typography} />}
                {project.colors && <ColorSection colors={project.colors} />}
                {project.techStack && <TechStackSection techStack={project.techStack} />}
                {project.footer && <FooterSection footer={project.footer} />}
            </main>
        </div>
    );
}
