// src/app/projects/[projectId]/page.tsx

import { projectsData } from "@/data/projects";
import { getProjectMarkdown } from "@/lib/project-content";
import ArticleLayout from "@/components/sections/project/layouts/ArticleLayout";
import ShowcaseLayout from "@/components/sections/project/layouts/ShowcaseLayout";
import { notFound } from "next/navigation";
import type { Metadata } from "next"; // Import Metadata

type Props = {
    params: Promise<{ projectId: string }>;
};

// Generate dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { projectId } = await params;
    const project = projectsData[projectId];

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    // Use subtitle or footer as description, falling back to a default
    const description = project.subtitle || project.footer?.slice(0, 160) || `Case study for ${project.name}`;

    return {
        title: project.name,
        description: description,
        openGraph: {
            title: `${project.name} | Jaxen Dutta`,
            description: description,
            type: "article",
            // If you have project images in your data, you can add them here:
            // images: [`/assets/${projectId}.png`], 
        },
    };
}

export default async function ProjectPage({ params }: Props) {
    const { projectId } = await params;
    const project = projectsData[projectId];

    if (!project) {
        notFound();
    }

    // Initialize content
    let markdownContent: string | null = null;

    // Only fetch markdown if it is an article layout
    if (project.layoutType === "article") {
        markdownContent = await getProjectMarkdown(projectId);
    }

    return project.layoutType === "article" ? (
        <ArticleLayout
            projectId={projectId}
            markdownContent={markdownContent || ""}
        />
    ) : (
        <ShowcaseLayout projectId={projectId} />
    )
}
