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

export interface ProjectMediaConfig {
    device: "desktop" | "mobile" | "tablet";
    mockup: "iphone" | "ipad" | "none";
    mockupColor?: "cosmic-orange" | "natural-titanium" | "black-titanium" | "silver" | "space-gray";
    source: string;
    boomerang?: boolean;
}

export interface Project {
    name: string;
    label: string;
    subtitle?: string;
    icon: IconType;
    cardFont?: string;
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
    image: ProjectMediaConfig;
}

export type ProjectsData = Record<string, Project>;

export function getProjectMedia(project: Project | undefined, id?: string): {
    source: string;
    device: "desktop" | "mobile" | "tablet";
    mockup: "iphone" | "ipad" | "none";
    mockupColor?: "cosmic-orange" | "natural-titanium" | "black-titanium" | "silver" | "space-gray";
    boomerang: boolean;
} {
    if (!project) {
        return {
            source: id ? `/${id}.png` : "",
            device: "mobile",
            mockup: "none",
            boomerang: false,
        };
    }

    return {
        source: project.image.source,
        device: project.image.device,
        mockup: project.image.mockup,
        mockupColor: project.image.mockupColor,
        boomerang: project.image.boomerang ?? false,
    };
}

export function formatProjectDate(date: ProjectDate): string {
    const startStr = date.start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!date.end) {
        return `${startStr} – Present`;
    }
    const endStr = date.end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return startStr === endStr ? startStr : `${startStr} – ${endStr}`;
}
