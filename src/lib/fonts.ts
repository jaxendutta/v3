// src/styles/fonts.ts
import {
    Major_Mono_Display,
    Fira_Code,
    Orbitron,
    Google_Sans_Flex,
    Google_Sans_Code
} from "next/font/google";

export const majorMono = Major_Mono_Display({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});

export const orbitron = Orbitron({
    subsets: ["latin"],
    display: "swap",
});

export const googleSansFlex = Google_Sans_Flex({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['300', '400', '500', '600', '700'],
});

export const googleSansCode = Google_Sans_Code({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['300', '400', '500', '600', '700'],
});

export const headingFont = majorMono.className;
export const displayFont = majorMono.className;
export const codeFont = googleSansCode.className;
