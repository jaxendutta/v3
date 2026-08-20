import { projectsData } from "@/data/projects";
import { slugifyLinkLabel, findProjectLinkBySlug } from "@/lib/project-links";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ projectId: string; linkSlug: string }>;
};

export async function generateStaticParams() {
    const params: { projectId: string; linkSlug: string }[] = [];

    for (const [projectId, project] of Object.entries(projectsData)) {
        if (project.links) {
            for (const link of project.links) {
                params.push({
                    projectId,
                    linkSlug: slugifyLinkLabel(link.label),
                });
            }
        }
    }

    return params;
}

export default async function ProjectLinkRedirectPage({ params }: Props) {
    const { projectId, linkSlug } = await params;
    const matchedLink = findProjectLinkBySlug(projectId, linkSlug);

    if (!matchedLink || !matchedLink.url) {
        notFound();
    }

    redirect(matchedLink.url);
}
