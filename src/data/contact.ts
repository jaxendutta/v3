// src/data/contactData.ts
import { Social } from "@/types/contact";

export const RESUME_DOC_URL =
    "https://docs.google.com/document/d/1624clRbgzAkiqR-YPmR3FJZoCAmO-RszkgIJjAUUumk/export?format=pdf";

export const CV_DOC_URL =
    "https://docs.google.com/document/d/1hPXUdpBJ-qb_sXpEkihDWRlX3D64aoi6Zbmi-7hn2JU/export?format=pdf";

export const socials: Social[] = [
    {
        label: "E-MAIL",
        handle: "jaxendutta[at]gmail.com",
        url: "mailto:jaxendutta@gmail.com",
    },
    {
        label: "GITHUB",
        handle: "/jaxendutta",
        url: "https://github.com/jaxendutta",
    },
    {
        label: "LINKEDIN",
        handle: "/jaxen",
        url: "https://www.linkedin.com/in/jaxen/",
    },
    {
        label: "RÉSUMÉ",
        url: "/resume",
        downloadUrl: "/resume?download=1",
        docUrl: RESUME_DOC_URL,
    },
    {
        label: "CURRICULUM VITAE",
        labelShort: "CV",
        url: "/cv",
        downloadUrl: "/cv?download=1",
        docUrl: CV_DOC_URL,
    }
];

export type ContactFormField = {
    name: string;
    type: string;
    required: boolean;
    help?: string;
};

export type FormField = {
    name: string;
    type: string;
    required: boolean;
    prefix?: string;
    maxLength?: number;
    showCount?: boolean;
};

export const formFields: FormField[] = [
    {
        name: "name",
        type: "text",
        required: true,
    },
    {
        name: "email",
        type: "email",
        required: true,
    },
    {
        name: "linkedin",
        type: "text",
        required: false,
        prefix: "LINKEDIN.COM/IN/",
    },
    {
        name: "message",
        type: "textarea",
        required: true,
        maxLength: 5000,
        showCount: true,
    },
];
