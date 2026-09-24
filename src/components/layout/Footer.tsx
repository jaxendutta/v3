// src/components/layout/Footer.tsx
"use client";

interface FooterProps {
    className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`w-full py-6 footer-standalone-pb text-center text-[11px] md:text-sm uppercase font-sans font-thin ${className}`}>
            Jaxen Anirban Dutta //
        </footer>
    );
}
