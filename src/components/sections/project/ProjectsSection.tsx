"use client";

import { projectsData } from "@/data/projectData";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/sections/project/ProjectCard";
import { GiStrongbox } from "react-icons/gi";
import RotatingButton from "@/components/ui/RotatingButton";

export default function ProjectsSection() {
    const projectIds = Object.keys(projectsData);
    const topCount = 3;

    return (
        <Section
            headerProps={{
                title: "PROJECTS",
                buttonProps: {
                    href: "/projects",
                    texts: ["Access the vault", "See them all"],
                    centerIcon: GiStrongbox,
                    className: "right-1/6",
                },
            }}
        >
            <div className="my-10 flex flex-col items-center">
                {projectIds
                    .slice(0, Math.min(topCount, projectIds.length))
                    .map((id, index) => (
                        <div
                            key={id}
                            className={`w-full px-2 py-8 border-b border-current ${index % 2 === 0 ? "border-r" : "border-l"}`}
                        >
                            <ProjectCard
                                id={id}
                                project={projectsData[id]}
                                reversed={index % 2 !== 0}
                            />
                        </div>
                    ))}
            </div>

            <RotatingButton
                texts={["See the rest", "Access the vault"]}
                href="/projects"
                centerIcon={GiStrongbox}
                variant="glow"
                className="-translate-y-[100%]"
            />
        </Section>
    );
}
