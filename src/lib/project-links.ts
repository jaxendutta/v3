import { projectsData } from "@/data/projects";

/**
 * Converts a project link label (e.g. "VS Code", "Open VSX", "GitHub")
 * into a URL-friendly slug (e.g. "vs-code", "open-vsx", "github").
 */
export function slugifyLinkLabel(label: string): string {
    return label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * Finds a matching link object for a given project ID and link slug.
 */
export function findProjectLinkBySlug(projectId: string, linkSlug: string) {
    const project = projectsData[projectId];
    if (!project || !project.links) return null;

    const normalizedSlug = linkSlug.toLowerCase().trim();
    return project.links.find(
        (link) => slugifyLinkLabel(link.label) === normalizedSlug
    ) || null;
}
