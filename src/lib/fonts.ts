// src/styles/fonts.ts
import {
    Major_Mono_Display,
    Fira_Code,
    Orbitron,
} from "next/font/google";

// Define fonts with next/font
export const majorMono = Major_Mono_Display({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});

export const firaCode = Fira_Code({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
});

export const orbitron = Orbitron({
    subsets: ["latin"],
    display: "swap",
});

export const headingFont = majorMono.className;
export const displayFont = majorMono.className;
export const codeFont = firaCode.className;
