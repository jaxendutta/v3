// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Direct colors that match your CSS variables
                theme: {
                    background: {
                        dark: "#18181b",
                        light: "#fff7ed",
                    },
                    text: {
                        dark: "#fff7ed",
                        light: "#1d4ed8",
                    },
                    accent: {
                        dark: "#e11d48",
                        light: "#f43f5e",
                    },
                    highlight: {
                        bg: {
                            dark: "#1e3a8a",
                            light: "#1d4ed8",
                        },
                        text: {
                            dark: "#bef264",
                            light: "#bef264",
                        },
                    },
                },
            },
            animation: {
                marquee: "marquee var(--duration) linear infinite",
                "marquee-vertical":
                    "marquee-vertical var(--duration) linear infinite",
                "spin-slow": "spin 10s linear infinite",
            },
            keyframes: {
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(calc(-100% - var(--gap)))" },
                },
                "marquee-vertical": {
                    from: { transform: "translateY(0)" },
                    to: { transform: "translateY(calc(-100% - var(--gap)))" },
                },
            },
            // Add screen variants for orientation
            screens: {
                landscape: { raw: "(orientation: landscape)" },
                portrait: { raw: "(orientation: portrait)" },
            },
        },
    },
    plugins: [],
};

export default config;
