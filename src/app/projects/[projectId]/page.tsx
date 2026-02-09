import { projectsData } from "@/data/projects";
import { getProjectMarkdown } from "@/lib/project-content";
import ArticleLayout from "@/components/sections/project/layouts/ArticleLayout";
import ShowcaseLayout from "@/components/sections/project/layouts/ShowcaseLayout";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";

// Next.js 15+ syntax for dynamic params
type Props = {
    params: Promise<{ projectId: string }>;
};

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

    return (
        <>
            {/* REMOVED: The global fixed back button. 
               The layouts now handle their own headers!
            */}

            {project.layoutType === "article" ? (
                <ArticleLayout 
                    projectId={projectId} 
                    markdownContent={markdownContent || ""} 
                />
            ) : (
                <ShowcaseLayout projectId={projectId} />
            )}
        </>
    );
}
