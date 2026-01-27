// src/components/ui/StyledLink.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { IconType } from "react-icons";
import { TbArrowElbowRight, TbArrowLeftFromArc } from "react-icons/tb";

interface StyledLinkProps extends LinkProps {
    text: string;
    icon?: IconType;
    iconPosition?: "left" | "right";
    className?: string;
}

const StyledLink = ({
    text,
    className = "",
    icon: Icon = TbArrowElbowRight,
    iconPosition = "right",
    ...props
}: StyledLinkProps) => {
    return (
        <div
            className={`flex items-start no-underline hover:text-accent ${className}`}
        >
            <Link
                replace
                scroll
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${iconPosition === "right" ? "flex-row-reverse" : "flex-row"}`}
                style={{
                    textDecoration: "none",
                }}
                {...props}
            >
                {Icon && <Icon />}
                {text}
            </Link>
        </div>
    );
};

export default StyledLink;
