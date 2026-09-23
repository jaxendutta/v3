"use client";

import { useEffect } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

const THEME_COLORS = {
    light: "#fff7ed",
    dark: "#18181b",
};

export default function BrowserThemeColor() {
    const { theme } = useTheme();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

        if (!isStandalone) {
            document.documentElement.classList.remove("standalone-mode");
            let meta = document.querySelector('meta[name="theme-color"]');
            if (!meta) {
                meta = document.createElement("meta");
                meta.setAttribute("name", "theme-color");
                document.head.appendChild(meta);
            }
            const activeColor =
                theme === "dark" ? THEME_COLORS.dark : THEME_COLORS.light;
            meta.setAttribute("content", activeColor);
        } else {
            document.documentElement.classList.add("standalone-mode");
            // In iOS PWA standalone mode, removing theme-color allows statusBarStyle: "black-translucent"
            // to achieve edge-to-edge full bleed without a forced solid tint bar.
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.remove();
            }
        }
    }, [theme]);

    return null;
}
