// src/types/presentation.ts

import { Duration } from ".";
import { Social } from "./contact";

export interface PresentationEmbed {
    /** SharePoint / OneDrive / Google Slides embed URL */
    url: string;
    /**
     * Explicit aspect ratio override. If omitted, parsed from the `wdAr`
     * query param in the URL (works for SharePoint/OneDrive). Falls back to 16/9.
     */
    aspectRatio?: number;
}

export interface PresentationEvent {
    /** Full official name — supports HTML (e.g. 1<sup>st</sup> ...) */
    long: string;
    /** Short/display name used as the page h1 — supports HTML. Falls back to long if omitted. */
    short?: string;
}

export interface Presentation {
    /** Presentation title — supports HTML (e.g. <em>"quoted"</em>: subtitle) */
    title: string;
    /** Academic abstract */
    abstract: string;
    /** Academic keywords, shown under the abstract */
    keywords?: string[];
    /** e.g. "Conference Talk", "Symposium Presentation", "Workshop", "Poster Session" */
    presentationType: string;
    /** Event name — short is used as the page headline, long goes in metadata */
    event?: PresentationEvent;
    /** Host organization */
    host?: string;
    /** Physical location string */
    location?: string;
    /** Session name within the event, e.g. "Digital Governance & AI" */
    session?: string;
    /** Event time range, e.g. "8:30 AM – 4:30 PM" */
    time?: string;
    duration: Duration;
    tags: string[];
    embed?: PresentationEmbed;
    /** Named external links — agenda, event page, recording, etc. */
    links?: Record<string, Social>;
    /** Awards, honours, or recognition received */
    recognition?: string[];
    status?: "presented" | "upcoming" | "cancelled";
}

export type PresentationsData = Record<string, Presentation>;
