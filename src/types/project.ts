// src/types/project.ts
import { IconType } from "react-icons";
import { Social } from "./contact";

export interface OverviewItem {
    className?: string;
    content: string;
}

export interface FontInfo {
    name: string;
    fontFamily: string;
    url: string;
    description: string;
}

export interface ColorSet {
    palette: string[];
    description: string;
}

export interface Tech {
    name: string;
    version?: string;
}

export type ProjectCategoryKey = "frontend" | "fullstack" | "data";

export const CATEGORY_MAP: Record<ProjectCategoryKey, string> = {
    frontend: "Frontend + UX/UI",
    fullstack: "Full-Stack",
    data: "Data Science + AI",
} as const;

export function getProjectCategoryLabels(categories: ProjectCategoryKey[]): string[] {
    if (!categories || categories.length === 0) return [];
    const hasFullStack = categories.includes("fullstack");
    return categories.map((cat) => {
        if (cat === "frontend" && hasFullStack) {
            return "Product Design";
        }
        return CATEGORY_MAP[cat] ?? cat;
    });
}

export interface ProjectDate {
    start: Date;
    end?: Date;
}

export interface Project {
    name: string;
    label: string;
    subtitle?: string;
    icon: IconType;
    type: "design" | "development" | "ai" | "research";
    categories: ProjectCategoryKey[];
    layoutType: "showcase" | "article";
    date: ProjectDate;
    overview?: OverviewItem[][];
    links: Social[];
    typography?: FontInfo[];
    colors?: ColorSet[];
    techStack?: Record<string, Tech[]>;
    footer?: string;
    screenshotDevice?: "desktop" | "mobile" | "tablet";
    image?: string;
}

export type ProjectsData = Record<string, Project>;

export function formatProjectDate(date: ProjectDate): string {
    const startStr = date.start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!date.end) {
        return `${startStr} – Present`;
    }
    const endStr = date.end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
}
