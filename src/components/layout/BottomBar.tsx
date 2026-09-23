// src/components/layout/BottomBar.tsx
"use client";

import DateTimePlace from "@/components/ui/DateTimePlace";
import ThemeSwitch from "@/components/theme/ThemeSwitch";
import { usePathname } from "next/navigation";

export default function BottomBar() {
    const pathname = usePathname() || "";

    const isPaperDocumentRoute = /^\/papers\/[^/]+\/[^/]+\/?$/.test(pathname);

    if (isPaperDocumentRoute) {
        return null;
    }

    return (
        <div className="w-full fixed bottom-0 z-100 flex items-center justify-between px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-theme mix-blend-difference invert dark:invert-0">
            <DateTimePlace />
            <ThemeSwitch />
        </div>
    );
}
