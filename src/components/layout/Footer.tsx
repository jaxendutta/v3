// src/components/layout/Footer.tsx
"use client";

interface FooterProps {
    className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
    return (
        <footer
            className={`w-full py-6 text-center text-sm uppercase font-sans font-thin ${className}`}
        >
            Jaxen Anirban Dutta //
        </footer>
    );
}
