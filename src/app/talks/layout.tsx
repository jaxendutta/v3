// src/app/talks/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Talks & Presentations ✧ Jaxen Dutta",
    description: "Conference talks, symposium presentations, and public speaking by Jaxen Anirban Dutta.",
    openGraph: {
        title: "Talks & Presentations ✧ Jaxen Dutta",
        description: "Conference talks, symposium presentations, and public speaking by Jaxen Anirban Dutta.",
    },
};

export default function TalksLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
