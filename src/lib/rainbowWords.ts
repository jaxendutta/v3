export const ALPHABET_WORDS = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz".split(" ");

// VIBGYOR bounced back on itself (…V I B G Y O R O Y G B I V…) so the color
// cycle has no seam - it just keeps rocking back and forth through the
// spectrum instead of hard-cutting from one end of the rainbow to the other.
export const RAINBOW_BOUNCE = [
    "#8B5CF6", // violet
    "#6366F1", // indigo
    "#3B82F6", // blue
    "#22C55E", // green
    "#EAB308", // yellow
    "#F97316", // orange
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#3B82F6", // blue
    "#6366F1", // indigo
];

export interface RainbowWord {
    text: string;
    color: string;
}

// Each alphabet word ("Aa", "Bb", …) gets the next color in the bounce, and
// picks up an extra trailing gap after "Zz" so the spacing rhythm marks
// where each lap around the alphabet ends.
export function makeRainbowWords(count: number): RainbowWord[] {
    return Array.from({ length: count }, (_, i) => {
        const wordIndex = i % ALPHABET_WORDS.length;
        const isEndOfAlphabet = wordIndex === ALPHABET_WORDS.length - 1;
        return {
            text: ALPHABET_WORDS[wordIndex] + (isEndOfAlphabet ? "   " : " "),
            color: RAINBOW_BOUNCE[i % RAINBOW_BOUNCE.length],
        };
    });
}
