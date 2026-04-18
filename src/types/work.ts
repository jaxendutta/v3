import { Duration } from ".";

// src/types/work.ts
export interface WorkTeam {
    name: string;
    url?: string;
}

export interface WorkExperience {
    title: string;
    company: string;
    url: string;
    duration: Duration;
    team: WorkTeam | null;
    skills: string[];
    description: string[];
}

export type WorkData = Record<string, WorkExperience>;
