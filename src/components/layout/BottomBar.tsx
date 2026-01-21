// src/components/layout/BottomBar.tsx
"use client";

import DateTimePlace from "@/components/ui/DateTimePlace";
import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { useTheme } from "@/components/theme/ThemeProvider";

export default function BottomBar() {
    const { theme } = useTheme();
    return (
        <div
            className={`w-full fixed bottom-0 z-10 flex items-center justify-between p-2 ${theme === "dark" ? "opacity-50" : "opacity-90"}`}
        >
            <DateTimePlace />
            <ThemeSwitch />
        </div>
    );
}
