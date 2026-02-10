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
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            mainElement.scrollLeft += e.deltaY; 
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
                        // FIX: 
                        // 1. '!w-fit' forces it to grow with content (overriding w-full).
                        // 2. 'snap-start' ensures the START is visible if it overflows. 
                        //    (snap-center pushes the start off-screen for huge elements).
                        // 3. 'min-w-full' ensures it centers nicely if the text is short.
                        ? "min-w-full !w-fit snap-start shrink-0 px-10" 
                        : "!min-h-[calc(100vh-100px)] !h-fit snap-start py-10 w-full shrink-0"
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