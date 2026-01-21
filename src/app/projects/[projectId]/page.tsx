// src/app/projects/[projectId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { projectsData } from "@/data/projectData";
import NameSection from "@/components/sections/project/sections/NameSection";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Skeleton from "@/components/ui/Skeleton";

// Dynamically load heavy sections with skeletons
const OverviewSection = dynamic(
    () => import("@/components/sections/project/sections/OverviewSection"),
    {
        loading: () => <Skeleton className="h-[80vh] w-full" />,
    }
);

const TypographySection = dynamic(
    () => import("@/components/sections/project/sections/TypographySection"),
    {
        loading: () => <Skeleton className="h-[80vh] w-full" />,
    }
);

const ColorSection = dynamic(
    () => import("@/components/sections/project/sections/ColorSection"),
    {
        loading: () => <Skeleton className="h-[80vh] w-full" />,
    }
);

const TechStackSection = dynamic(
    () => import("@/components/sections/project/sections/TechStackSection"),
    {
        loading: () => <Skeleton className="h-[80vh] w-full" />,
    }
);

const FooterSection = dynamic(
    () => import("@/components/sections/project/sections/FooterSection"),
    {
        loading: () => <Skeleton className="h-[80vh] w-full" />,
    }
);

export default function ProjectPage() {
    const { projectId } = useParams();
    const id = typeof projectId === "string" ? projectId : projectId?.[0] || "";
    const project = projectsData[id];

    const mainRef = useRef<HTMLElement>(null);
    const [titleVisible, setTitleVisible] = useState(false);
    const [isLandscape, setIsLandscape] = useState(true);

    // Custom hook for window dimensions
    const useWindowSize = () => {
        const [size, setSize] = useState({
            width: globalThis.window?.innerWidth || 0,
            height: globalThis.window?.innerHeight || 0,
        });

        useEffect(() => {
            if (typeof window === "undefined") return;

            const handleResize = () => {
                setSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };

            handleResize();
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return size;
    };

    // Use the hook to get window dimensions
    const { width, height } = useWindowSize();

    // Update isLandscape based on dimensions
    useEffect(() => {
        setIsLandscape(width > height);
    }, [width, height]);

    // Simple wheel event handler to convert vertical scrolling to horizontal
    useEffect(() => {
        if (!isLandscape || !mainRef.current) return;

        const mainElement = mainRef.current;

        const handleWheel = (e: WheelEvent) => {
            // Only prevent default for vertical scrolling
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();

                // Apply the vertical delta to horizontal scrolling
                const scrollAmount = e.deltaY * 200;

                mainElement.scrollBy({
                    left: scrollAmount,
                    behavior: "smooth", // Use 'auto' for more responsive feel maybe
                });
            }
            // Let horizontal scrolling work naturally
        };

        // Add event listener with passive: false to allow preventDefault()
        mainElement.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            mainElement.removeEventListener("wheel", handleWheel);
        };
    }, [isLandscape]);

    // Efficient header visibility management
    useEffect(() => {
        const updateHeaderVisibility = () => {
            const section = document.getElementById("project-name");
            if (section) {
                const rect = section.getBoundingClientRect();
                setTitleVisible(isLandscape && rect.right <= 10);
            }
        };

        // Initial check
        updateHeaderVisibility();

        // Use requestAnimationFrame for better performance
        let rafId: number;
        const handleScroll = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateHeaderVisibility);
        };

        const container = mainRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => {
                cancelAnimationFrame(rafId);
                container.removeEventListener("scroll", handleScroll);
            };
        }
    }, [isLandscape]);

    return (
        <div className="h-screen w-screen overflow-hidden relative">
            <ProjectsPageHeader
                titleVisible={titleVisible}
                isLandscape={isLandscape}
            />

            <main
                ref={mainRef}
                className={`
                    h-screen w-screen scroll-smooth snap-mandatory no-scrollbar flex gap-20 scroll-pt-[100px] pt-[100px]
                    ${
                        isLandscape
                            ? "flex-row overflow-x-auto overflow-y-hidden snap-x"
                            : "flex-col overflow-y-auto overflow-x-hidden snap-y"
                    }`}
            >
                <NameSection
                    name={project.name}
                    className={isLandscape ? "mb-[10vh]" : ""}
                />

                {project.overview && (
                    <OverviewSection
                        overview={project.overview}
                        links={project.links}
                    />
                )}

                {project.typography && project.typography.length > 0 && (
                    <TypographySection typography={project.typography} />
                )}

                {project.colors && project.colors.length > 0 && (
                    <ColorSection colors={project.colors} />
                )}

                {project.techStack &&
                    Object.keys(project.techStack).length > 0 && (
                        <TechStackSection techStack={project.techStack} />
                    )}

                {project.footer && <FooterSection footer={project.footer} />}
            </main>
        </div>
    );
}
