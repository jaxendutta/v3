// src/components/layout/SafeAreaScrim.tsx
"use client";

import { usePathname } from "next/navigation";

// The home page has its own full-bleed hero art behind the notch, so it
// doesn't need this. Every other page has nothing painted that high up —
// without this, the notch just shows flat page background.
export default function SafeAreaScrim() {
    const pathname = usePathname() || "";

    if (pathname === "/") {
        return null;
    }

    return (
        <div
            className="fixed inset-x-0 top-0 z-60 h-[env(safe-area-inset-top)] bg-background/70 backdrop-blur-md pointer-events-none"
            aria-hidden="true"
        />
    );
}
