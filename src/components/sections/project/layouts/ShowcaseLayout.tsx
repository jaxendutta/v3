"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { projectsData } from "@/data/projects";
import NameSection from "@/components/sections/project/sections/NameSection";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Skeleton from "@/components/ui/Skeleton";

// Dynamic imports (kept from your original file)
const OverviewSection = dynamic(() => import("@/components/sections/project/sections/OverviewSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const TypographySection = dynamic(() => import("@/components/sections/project/sections/TypographySection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const ColorSection = dynamic(() => import("@/components/sections/project/sections/ColorSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const TechStackSection = dynamic(() => import("@/components/sections/project/sections/TechStackSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });
const FooterSection = dynamic(() => import("@/components/sections/project/sections/FooterSection"), { loading: () => <Skeleton className="h-[80vh] w-full" /> });

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

    // Horizontal scroll logic
    useEffect(() => {
        if (!isLandscape || !mainRef.current) return;
        const mainElement = mainRef.current;
        const handleWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                mainElement.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
            }
        };
        mainElement.addEventListener("wheel", handleWheel, { passive: false });
        return () => mainElement.removeEventListener("wheel", handleWheel);
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
        <div className="h-screen w-screen overflow-hidden relative bg-background text-foreground">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={isLandscape} />

            <main
                ref={mainRef}
                className={`
                    h-screen w-screen scroll-smooth snap-mandatory no-scrollbar flex gap-20 scroll-pt-[100px] pt-[100px]
                    ${isLandscape ? "flex-row overflow-x-auto overflow-y-hidden snap-x" : "flex-col overflow-y-auto overflow-x-hidden snap-y"}
                `}
            >
                <NameSection name={project.name} className={isLandscape ? "mb-[10vh]" : ""} />

                {project.overview && <OverviewSection overview={project.overview} links={project.links} />}
                {project.typography && <TypographySection typography={project.typography} />}
                {project.colors && <ColorSection colors={project.colors} />}
                {project.techStack && <TechStackSection techStack={project.techStack} />}
                {project.footer && <FooterSection footer={project.footer} />}
            </main>
        </div>
    );
}
