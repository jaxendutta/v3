// src/types/paper.ts

import { Duration } from ".";

export type DocumentType = "paper" | "poster" | "slides" | "project" | "bib";

/**
 * A single compiled document artifact (PDF) associated with a written work.
 * Multiple documents represent different formats/versions of the same work.
 *
 * Example:
 *   { label: "UW Thesis Format", url: "/papers/emma/thesis/emma.pdf", type: "paper" }
 *   { label: "ACM Format",       url: "/papers/emma/acm/emma.pdf",    type: "paper" }
 *   { label: "Conference Poster",url: "/papers/emma/poster/emma.pdf", type: "poster" }
 */
export interface PaperDocument {
    /** Human-readable label shown on the link button, e.g. "UW Thesis", "ACM Format" */
    label: string;
    /** Document kind — drives icon selection in the UI */
    type: DocumentType;
}

/**
 * A written work entry — thesis, report, essay, paper, etc.
 */
export interface Paper {
    /** Display title */
    title: string;
    /** Optional subtitle or venue tagline */
    abstract: string;
    /** Type of paper, e.g. Research Report, Literature Survey, Case Study, Academic Essay */
    paperType: string;
    /** Publication venue or degree program, e.g. "University of Waterloo" */
    venue?: string[];
    /** Date of submission / publication / last revision */
    duration: Duration;
    /** Keyword tags, analogous to skills in WorkExperience */
    tags: string[];
    /**
     * Optional reference to a project in src/data/projects.ts.
     * When set, the expanded card shows a "→ See Project" badge.
     */
    projectId?: string;
    /**
     * Named dictionary of document artifacts.
     * Keys are internal identifiers (e.g. "thesis", "acm", "poster").
     * Order matters — rendered top-to-bottom in the documents column.
     */
    links: Record<string, PaperDocument>;
    /** Publication status badge */
    status?: "published" | "submitted" | "in-review" | "draft";
}

export type PapersData = Record<string, Paper>;
