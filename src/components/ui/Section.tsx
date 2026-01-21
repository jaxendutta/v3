// src/components/ui/Section.tsx
"use client";

import SectionHeader, {
    SectionHeaderProps,
} from "@/components/ui/SectionHeader";

interface SectionProps {
    headerProps: SectionHeaderProps;
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function Section({
    headerProps: headerProps,
    children,
    className = "",
}: SectionProps) {
    return (
        <section
            id={headerProps.title.toLowerCase()}
            className={`relative w-full ${className}`}
        >
            <SectionHeader {...headerProps} />
            <div className="p-[5vw]">{children}</div>
        </section>
    );
}
