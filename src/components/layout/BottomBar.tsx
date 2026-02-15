// src/components/layout/BottomBar.tsx
"use client";

import DateTimePlace from "@/components/ui/DateTimePlace";
import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function BottomBar() {
    const { theme } = useTheme();
    return (
        <div
            className={`w-full fixed bottom-0 z-100 flex items-center justify-between mix-blend-difference p-2 ${theme === "dark" ? "opacity-50" : "opacity-90 text-yellow-300"}`}
        >
            <DateTimePlace />
            <ThemeSwitch />
        </div>
    );
}
