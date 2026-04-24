// src/components/layout/BottomBar.tsx
"use client";

import DateTimePlace from "@/components/ui/DateTimePlace";
import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { useTheme } from "@/components/theme/ThemeProvider";
import { usePathname } from "next/navigation";

export default function BottomBar() {
    const { theme } = useTheme();
    const pathname = usePathname() || "";

    const isPaperDocumentRoute = /^\/papers\/[^/]+\/[^/]+\/?$/.test(pathname);

    if (isPaperDocumentRoute) {
        return null;
    }

    return (
        <div className={`w-full fixed bottom-0 z-100 flex items-center justify-between p-2 text-muted-foreground-subtle`}>
            <DateTimePlace />
            <ThemeSwitch />
        </div>
    );
}
