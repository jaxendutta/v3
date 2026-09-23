// src/components/ui/Tag.tsx
import { motion } from "framer-motion";

interface TagProps {
    text: string;
    glowOnHover?: boolean;
    href?: string;
    action?: () => void;
    className?: string;
}

const Tag = ({ text, glowOnHover = false, href, action, className = "" }: TagProps) => {
    const commonProps = {
        className:
            `px-2 md:px-3 py-1 border border-current rounded-full text-[10px] md:text-sm whitespace-nowrap cursor-pointer leading-none md:leading-tight font-thin ${className}`,
        style: {
            textDecoration: "none",
        },
        whileHover: {
            backgroundColor: "var(--card-fg, var(--foreground, var(--color-text)))",
            color: "var(--card-bg, var(--background, var(--color-background)))",
            border: "1px solid var(--card-fg, var(--foreground, var(--color-text)))",
            boxShadow: "none",
        },
        transition: { duration: 0.15 },
    };

    if (href) {
        return (
            <motion.a
                {...commonProps}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
            >
                {text}
            </motion.a>
        );
    }

    if (action) {
        return (
            <motion.button {...commonProps} onClick={action}>
                {text}
            </motion.button>
        );
    }

    return <motion.span {...commonProps}>{text}</motion.span>;
};

export const SkillTag = ({ skill }: { skill: string }) => {
    return (
        <Tag
            text={skill}
            glowOnHover={false}
            href={`/projects?tech=${encodeURIComponent(skill.toLowerCase())}`}
        />
    );
};

export default Tag;
