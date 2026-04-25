// src/app/projects/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects ✧ Jaxen Dutta",
    description: "Explore the design, development, and research projects of Jaxen Anirban Dutta.",
    openGraph: {
        title: "Projects ✧ Jaxen Dutta",
        description: "Explore the design, development, and research projects of Jaxen Anirban Dutta.",
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
