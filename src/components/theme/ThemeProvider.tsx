// src/components/theme/ThemeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeOption } from "@/lib/theme";

interface ThemeContextType {
    theme: ThemeOption;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This wrapper component forces a re-render when the key changes
function ThemeWrapper({
    children,
    theme,
}: {
    children: React.ReactNode;
    theme: ThemeOption;
}) {
    return <div key={theme}>{children}</div>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<ThemeOption>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Get theme from localStorage if available
        const storedTheme = localStorage.getItem("theme") as ThemeOption | null;
        const systemPrefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        const initialTheme =
            storedTheme || (systemPrefersDark ? "dark" : "light");
        setTheme(initialTheme);
        setMounted(true);

        // Listen for system theme changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const isDark = theme === "dark";

        // Toggle the dark/light class on the html element
        document.documentElement.classList.toggle("dark", isDark);
        document.documentElement.classList.toggle("light", !isDark);
    }, [theme, mounted]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    // Avoid rendering with default theme to prevent flash
    if (!mounted) {
        return <div className="hidden" />;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {/* The key forces a complete re-render when theme changes */}
            <ThemeWrapper theme={theme}>{children}</ThemeWrapper>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
