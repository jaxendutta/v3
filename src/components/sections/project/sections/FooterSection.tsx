// src/components/sections/project/sections/FooterSection.tsx
"use client";

interface FooterSectionProps {
    id?: string;
    footer: string;
}

export default function FooterSection({ id, footer }: FooterSectionProps) {
    return (
        <section
            id={id}
            className="flex-none w-screen h-screen flex items-center justify-center text-center text-xs md:text-sm font-sans snap-start"
        >
            <div className="max-w-[60vw] flex flex-col gap-8">
                {footer}
                <span>JAXEN ANIRBAN DUTTA //</span>
            </div>
        </section>
    );
}
