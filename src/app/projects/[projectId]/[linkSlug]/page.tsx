import { findProjectLinkBySlug } from "@/lib/project-links";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
    params: Promise<{ projectId: string; linkSlug: string }>;
};

export default async function ProjectLinkRedirectPage({ params }: Props) {
    const { projectId, linkSlug } = await params;
    const matchedLink = findProjectLinkBySlug(projectId, linkSlug);

    if (!matchedLink || !matchedLink.url) {
        notFound();
    }

    redirect(matchedLink.url);
}
