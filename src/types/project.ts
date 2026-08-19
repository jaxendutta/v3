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

export interface Project {
    name: string;
    label: string;
    subtitle?: string;
    icon: IconType;
    type: "design" | "development" | "ai" | "research";
    categories: ProjectCategoryKey[];
    layoutType: "showcase" | "article";
    date: Date;
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
