import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { papersData } from "@/data/papers";
import { projectsData } from "@/data/projects";
import { presentationsData } from "@/data/presentations";

/**
 * Automatically scans the `src/app` directory to discover static page routes.
 * Ignores dynamic parameter directories (starting with `[`), route groups (starting with `(`),
 * private folders (starting with `_`), and non-page directories.
 */
function getStaticAppRoutes(dir: string, baseDir: string = dir): string[] {
    const routes: string[] = [];
    if (!fs.existsSync(dir)) return routes;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (
                entry.name.startsWith("[") ||
                entry.name.startsWith("(") ||
                entry.name.startsWith("_") ||
                entry.name === "logo_archive"
            ) {
                continue;
            }
            routes.push(...getStaticAppRoutes(path.join(dir, entry.name), baseDir));
        } else if (entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
            const relativePath = path.relative(baseDir, dir);
            const routePath = relativePath ? `/${relativePath.replace(/\\/g, "/")}` : "/";
            routes.push(routePath);
        }
    }

    return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anirban.ca";
    const lastModified = new Date();

    // 1. Automatically discover static app routes by scanning src/app for page files
    const appDir = path.join(process.cwd(), "src", "app");
    const discoveredStaticRoutes = getStaticAppRoutes(appDir);

    const staticRoutes: MetadataRoute.Sitemap = discoveredStaticRoutes.map((route) => ({
        url: route === "/" ? baseUrl : `${baseUrl}${route}`,
        lastModified,
        changeFrequency: route === "/" ? "weekly" : "monthly",
        priority: route === "/" ? 1.0 : 0.8,
    }));

    // 2. Automatically generate dynamic paper routes from papersData
    const paperRoutes: MetadataRoute.Sitemap = [];
    Object.entries(papersData).forEach(([paperId, paper]) => {
        const itemLastMod = paper.duration?.end || paper.duration?.start || lastModified;
        paperRoutes.push({
            url: `${baseUrl}/papers/${paperId}`,
            lastModified: itemLastMod,
            changeFrequency: "monthly",
            priority: 0.8,
        });

        if (paper.links) {
            Object.entries(paper.links).forEach(([formatKey, doc]) => {
                if (doc.type !== "project") {
                    paperRoutes.push({
                        url: `${baseUrl}/papers/${paperId}/${formatKey}`,
                        lastModified: itemLastMod,
                        changeFrequency: "monthly",
                        priority: 0.6,
                    });
                }
            });
        }
    });

    // 3. Automatically generate dynamic project routes from projectsData
    const projectRoutes: MetadataRoute.Sitemap = Object.entries(projectsData).map(
        ([projectId, project]) => {
            const itemLastMod = project.date?.end || project.date?.start || lastModified;
            return {
                url: `${baseUrl}/projects/${projectId}`,
                lastModified: itemLastMod,
                changeFrequency: "monthly",
                priority: 0.8,
            };
        }
    );

    // 4. Automatically generate dynamic talk routes from presentationsData
    const talkRoutes: MetadataRoute.Sitemap = Object.entries(presentationsData).map(
        ([talkId, presentation]) => {
            const itemLastMod = presentation.duration?.end || lastModified;
            return {
                url: `${baseUrl}/talks/${talkId}`,
                lastModified: itemLastMod,
                changeFrequency: "monthly",
                priority: 0.7,
            };
        }
    );

    return [...staticRoutes, ...paperRoutes, ...projectRoutes, ...talkRoutes];
}
