// src/types/project.ts
import { IconType } from "react-icons";

export interface OverviewItem {
    className?: string;
    content: string;
}

// src/types/project.ts
export interface ProjectLink {
    name: string;
    url: string;
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

export interface ProjectData {
    name: string;
    subtitle?: string;
    icon: IconType;
    type?: "design" | "development" | "ai" | "research";
    date: Date;
    overview: OverviewItem[][];
    links: ProjectLink[];
    typography?: FontInfo[];
    colors?: ColorSet[];
    techStack?: Record<string, string[]>;
    footer?: string;
    screenshotDevice?: "desktop" | "mobile" | "tablet";
}

export type ProjectsData = Record<string, ProjectData>;
