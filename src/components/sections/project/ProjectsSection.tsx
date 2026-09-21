"use client";

import { projectsData } from "@/data/projects";
import Section from "@/components/ui/Section";
import ProjectCard from "@/components/sections/project/ProjectCard";
import WavyDivider from "@/components/ui/WavyDivider";
import WavyButton from "@/components/ui/WavyButton";
import { GiStrongbox } from "react-icons/gi";

export default function ProjectsSection() {
    const finishedProjectIds = Object.keys(projectsData).filter(
        (id) => projectsData[id].date.end !== undefined
    );
    const topCount = 3;
    const displayedProjectIds = finishedProjectIds.slice(
        0,
        Math.min(topCount, finishedProjectIds.length)
    );

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
                {displayedProjectIds.map((id, index) => (
                    <div key={id} className="w-full">
                        <div className="w-full py-8">
                            <ProjectCard
                                id={id}
                                project={projectsData[id]}
                                reversed={index % 2 !== 0}
                            />
                        </div>
                        {index < displayedProjectIds.length - 1 && (
                            <WavyDivider className="w-full my-4 text-current opacity-60" />
                        )}
                    </div>
                ))}
            </div>

            <div className="w-full mt-6 mb-8">
                <WavyButton href="/projects">
                    view all projects
                </WavyButton>
            </div>
        </Section>
    );
}
