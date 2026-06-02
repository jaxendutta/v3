// src/styles/fonts.ts
import {
    Major_Mono_Display,
    Google_Sans_Flex,
    Google_Sans_Code,
    Libre_Baskerville,
    Baskervville_SC,
    Playfair_Display,
} from "next/font/google";
import localFont from "next/font/local";

export const mignova = localFont({
    src: '../../public/fonts/Mignova.ttf',
    variable: '--font-mignova',
    display: 'swap',
});

export const csDevious = localFont({
    src: '../../public/fonts/CSDevious/csdevious-regular.otf',
    variable: '--font-cs-devious',
    display: 'swap',
});

export const csDeviousItalic = localFont({
    src: '../../public/fonts/CSDevious/csdevious-italic.otf',
    variable: '--font-cs-devious-italic',
    display: 'swap',
});

export const csDeviousReverseItalic = localFont({
    src: '../../public/fonts/CSDevious/csdevious-reverseitalic.otf',
    variable: '--font-cs-devious-reverse-italic',
    display: 'swap',
});

export const csDeviousStippled = localFont({
    src: '../../public/fonts/CSDeviousStippled_demo.otf',
    variable: '--font-cs-devious-stippled',
    display: 'swap',
});

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

export const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    style: ['normal', 'italic'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
});

export const headingFont = majorMono.className;
export const displayFont = majorMono.className;
export const codeFont = googleSansCode.className;
export const sansFont = googleSansFlex.className;
export const serifFont = playfairDisplay.className;
export const serifSCFont = baskervilleSC.className;
export const csDeviousStippledFont = csDeviousStippled.className;
export const csDeviousFont = csDevious.className;
export const csDeviousItalicFont = csDeviousItalic.className;
export const csDeviousReverseItalicFont = csDeviousReverseItalic.className;
export const mignovaFont = mignova.className;
