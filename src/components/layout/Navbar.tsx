// src/components/navigation/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme/ThemeProvider";

// Define nav link type with proper typing
type NavLinkType = {
    name: string;
    href: string;
    section: string;
};

// Navigation data
const navLinks: NavLinkType[] = [
    { name: "HOME", href: "#main", section: "main" },
    { name: "PROJECTS", href: "#projects", section: "projects" },
    { name: "WORK", href: "#work", section: "work" },
    { name: "CONTACT", href: "#contact", section: "contact" },
];

// NavLink component with proper hover effects
interface NavLinkProps extends NavLinkType {
    className?: string;
    isActive?: boolean;
}

function NavLink({ name, href, className = "" }: NavLinkProps) {
    // Hover state for custom effects that can't be done with Tailwind alone
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link
            href={href}
            className={`flex items-center gap-1 relative no-underline font-medium text-md md:text-lg lg:text-xl ${className}`}
            style={{
                color: "inherit",
                textDecoration: "none",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="transition-opacity duration-200">
                {isHovered ? ">" : "\\"}
            </span>

            {/* Link text */}
            {name}

            {/* Underline indicator that animates from left to right */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5"
                style={{ backgroundColor: "var(--color-accent)" }}
                initial={{ width: "0%" }}
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.2 }}
            />
        </Link>
    );
}

export default function Navbar() {
    // Split links for layout
    const linkLength = navLinks.length / 2;
    const leftLinks = navLinks.slice(0, linkLength);
    const rightLinks = navLinks.slice(linkLength);
    const { theme } = useTheme();

    return (
        <nav
            className={`fixed left-0 right-0 top-0 z-50 p-4 text-theme mix-blend-difference ${theme === "light" && "invert"}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-6">
                    {leftLinks.map((link) => (
                        <NavLink key={link.name} {...link} />
                    ))}
                </div>

                <div className="flex items-center justify-between gap-6">
                    {rightLinks.map((link) => (
                        <NavLink key={link.name} {...link} />
                    ))}
                </div>
            </div>
        </nav>
    );
}
