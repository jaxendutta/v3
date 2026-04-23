"use client";

import { projectsData } from "@/data/projects";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/sections/project/ProjectCard";
import { GiStrongbox } from "react-icons/gi";
import Link from "next/link";

export default function ProjectsSection() {
    const projectIds = Object.keys(projectsData);
    const topCount = 3;

    return (
        <Section
            id="projects"
            headerProps={{
                title: "pRojects",
                buttonProps: {
                    href: "/projects",
                    texts: ["Access the vault", "See them all"],
                    centerIcon: GiStrongbox,
                    className: "right-1/6",
                },
            }}
        >
            <div className="flex flex-col items-center">
                {projectIds
                    .slice(0, Math.min(topCount, projectIds.length))
                    .map((id, index) => (
                        <div
                            key={id}
                            className={`w-full py-8 border-b border-current ${index % 2 === 0 ? "border-r pr-2" : "border-l pl-2"}`}
                        >
                            <ProjectCard
                                id={id}
                                project={projectsData[id]}
                                reversed={index % 2 !== 0}
                                chain
                            />
                        </div>
                    ))}
            </div>

            <Link href="/projects" className={`flex justify-center no-underline! border-b border-foreground hover:bg-foreground hover:text-background! py-3 mb-8 transition-all duration-500 uppercase text-[13px] md:text-base`}>
                view all projects
            </Link>
        </Section>
    );
}
