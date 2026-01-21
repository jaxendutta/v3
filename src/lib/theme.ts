// src/lib/theme.ts
export type ThemeOption = "dark" | "light";

// Export color values for JS use
export const THEME_COLORS = {
    background: {
        dark: "#18181b", // zinc-900
        light: "#fff7ed", // orange-50
    },
    text: {
        dark: "#fff7ed", // orange-50
        light: "#1d4ed8", // blue-700
    },
    accent: {
        dark: "#e11d48", // rose-600
        light: "#f43f5e", // rose-500
    },
    highlight: {
        bg: {
            dark: "#1e3a8a", // blue-900
            light: "#1d4ed8", // blue-700
        },
        text: {
            dark: "#bef264", // lime-300
            light: "#bef264", // lime-300
        },
    },
};

// CSS variables for non-color properties
export const THEME_VARIABLES = {
    dark: {
        fontBackground: "url('https://i.gifer.com/ByRk.gif')",
        noiseFilter: "contrast(145%) brightness(650%) invert(100%)",
    },
    light: {
        fontBackground:
            "url('https://media.giphy.com/media/YAxpwobytgjWgmIbP9/giphy.gif')",
        noiseFilter: "contrast(125%) brightness(400%) invert(0%)",
    },
};
