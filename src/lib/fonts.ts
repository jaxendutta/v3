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

export const newRomantics = localFont({
    src: '../../public/fonts/new_romantics.ttf',
    variable: '--font-new-romantics',
    display: 'swap',
});

export const waterResistant = localFont({
    src: '../../public/fonts/water_resistant.ttf',
    variable: '--font-water-resistant',
    display: 'swap',
});

export const acidic = localFont({
    src: '../../public/fonts/acidic.ttf',
    variable: '--font-acidic',
    display: 'swap',
    declarations: [
        { prop: 'size-adjust', value: '88%' },
    ],
});

export const schizoidPersonality = localFont({
    src: '../../public/fonts/schizoid_personality.otf',
    variable: '--font-schizoid-personality',
    display: 'swap',
});

export const josephin = localFont({
    src: '../../public/fonts/josephin.ttf',
    variable: '--font-josephin',
    display: 'swap',
});

export const stripeDisco = localFont({
    src: '../../public/fonts/stripedisco.ttf',
    variable: '--font-stripe-disco',
    display: 'swap',
    declarations: [
        { prop: 'size-adjust', value: '125%' },
    ],
});

export const lunazzi = localFont({
    src: '../../public/fonts/lunazzi.ttf',
    variable: '--font-lunazzi',
    display: 'swap',
});

export const jackTheHipper = localFont({
    src: '../../public/fonts/jack_the_hipper.otf',
    variable: '--font-jack-the-hipper',
    display: 'swap',
});

export const lostar = localFont({
    src: '../../public/fonts/lostar.ttf',
    variable: '--font-lostar',
    display: 'swap',
});

export const damsterdam = localFont({
    src: '../../public/fonts/damsterdam.ttf',
    variable: '--font-damsterdam',
    display: 'swap'
});

export const modernPrestige = localFont({
    src: '../../public/fonts/modern_prestige.otf',
    variable: '--font-modern-prestige',
    display: 'swap',
});

export const rc = localFont({
    src: '../../public/fonts/r_c.otf',
    variable: '--font-rc',
    display: 'swap',
    declarations: [
        { prop: 'size-adjust', value: '88%' },
    ],
});

export const stampTypo = localFont({
    src: '../../public/fonts/stamp_typo.ttf',
    variable: '--font-stamp-typo',
    display: 'swap',
});


export const blastimoSans = localFont({
    src: '../../public/fonts/blastimo_sans.ttf',
    variable: '--font-blastimo-sans',
    display: 'swap',
    declarations: [
        { prop: 'size-adjust', value: '125%' },
    ],
});

export const beaconAesthetic = localFont({
    src: '../../public/fonts/beacon_aesthetic.ttf',
    variable: '--font-beacon-aesthetic',
    display: 'swap',
});

export const brushstrike = localFont({
    src: '../../public/fonts/brushstrike_trial.ttf',
    variable: '--font-brushstrike',
    display: 'swap',
    declarations: [
        { prop: 'size-adjust', value: '125%' },
    ],
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
    adjustFontFallback: false,
});

export const googleSansFlex = Google_Sans_Flex({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    variable: '--font-google-sans-flex',
    adjustFontFallback: false,
    fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
});

export const googleSansCode = Google_Sans_Code({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    variable: '--font-google-sans-code',
    adjustFontFallback: false,
    fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
});

export const baskerville = Libre_Baskerville({
    subsets: ["latin"],
    style: ['normal', 'italic'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
    adjustFontFallback: false,
});

export const baskervilleSC = Baskervville_SC({
    subsets: ["latin"],
    style: ['normal'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
    adjustFontFallback: false,
});

export const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    style: ['normal', 'italic'],
    display: "swap",
    weight: ['400', '500', '600', '700'],
    adjustFontFallback: false,
});

export const headingFont = majorMono?.className || "";
export const displayFont = majorMono?.className || "";
export const codeFont = googleSansCode?.className || "";
export const sansFont = googleSansFlex?.className || "";
export const serifFont = playfairDisplay?.className || "";
export const baskervilleFont = baskerville?.className || "";
export const serifSCFont = baskervilleSC?.className || "";
export const csDeviousStippledFont = csDeviousStippled?.className || "";
export const csDeviousFont = csDevious?.className || "";
export const csDeviousItalicFont = csDeviousItalic?.className || "";
export const csDeviousReverseItalicFont = csDeviousReverseItalic?.className || "";
export const mignovaFont = mignova?.className || "";
export const newRomanticsFont = newRomantics?.className || "";
export const waterResistantFont = waterResistant?.className || "";
export const acidicFont = acidic?.className || "";
export const schizoidPersonalityFont = schizoidPersonality?.className || "";
export const josephinFont = josephin?.className || "";
export const stripeDiscoFont = stripeDisco?.className || "";
export const lunazziFont = `${lunazzi?.className || ""} leading-[0.8]! md:leading-[0.8]!`;
export const jackTheHipperFont = jackTheHipper?.className || "";
export const lostarFont = lostar?.className || "";
export const damsterdamFont = damsterdam?.className || "";
export const modernPrestigeFont = modernPrestige?.className || "";
export const rcFont = rc?.className || "";
export const stampTypoFont = stampTypo?.className || "";
export const blastimoSansFont = `${blastimoSans?.className || ""} leading-[1.35]! md:leading-[1.3]!`;
export const beaconAestheticFont = beaconAesthetic?.className || "";
export const brushstrikeFont = brushstrike?.className || "";
