// src/components/theme/ThemeProvider.tsx
"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { ThemeOption } from "@/lib/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
        >
            {children}
        </NextThemesProvider>
    );
}

export function useTheme() {
    const { theme, setTheme, resolvedTheme } = useNextTheme();
    const currentTheme = (resolvedTheme || theme || "light") as ThemeOption;

    const toggleTheme = React.useCallback(() => {
        const nextTheme = currentTheme === "dark" ? "light" : "dark";

        if (
            typeof document !== "undefined" &&
            "startViewTransition" in document &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            document.documentElement.classList.add("theme-transitioning");
            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setTheme(nextTheme);
                });
            });
            transition.finished.finally(() => {
                document.documentElement.classList.remove("theme-transitioning");
            });
        } else {
            setTheme(nextTheme);
        }
    }, [currentTheme, setTheme]);

    return {
        theme: currentTheme,
        setTheme,
        toggleTheme,
    };
}

