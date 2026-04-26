// src/styles/fonts.ts
import {
    Major_Mono_Display,
    Google_Sans_Flex,
    Google_Sans_Code,
    Libre_Baskerville,
    Baskervville_SC
} from "next/font/google";

export const majorMono = Major_Mono_Display({
    weight: ['400'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap',
});

export const googleSansFlex = Google_Sans_Flex({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-google-sans-flex',
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
});

export const googleSansCode = Google_Sans_Code({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-google-sans-code',
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
});

export const baskerville = Libre_Baskerville({
    subsets: ["latin"],
    style: ['normal', 'italic'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
});

export const baskervilleSC = Baskervville_SC({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
});

export const headingFont = majorMono.className;
export const displayFont = majorMono.className;
export const codeFont = googleSansCode.className;
export const sansFont = googleSansFlex.className;
export const serifFont = baskerville.className;
export const serifSCFont = baskervilleSC.className;
