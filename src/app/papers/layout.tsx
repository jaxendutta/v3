// src/app/papers/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Papers & Written Records ✧ Jaxen Dutta",
    description: "Academic papers, research writings, and written records by Jaxen Dutta.",
};

export default function PapersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
