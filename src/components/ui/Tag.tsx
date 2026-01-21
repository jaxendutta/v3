// src/components/ui/Tag.tsx
import { motion } from "framer-motion";

interface TagProps {
    text: string;
    glowOnHover?: boolean;
    href?: string;
    action?: () => void;
}

const Tag = ({ text, glowOnHover = false, href, action }: TagProps) => {
    const commonProps = {
        className:
            "px-3 py-1 border border-current rounded-full text-xs md:text-sm whitespace-nowrap cursor-pointer",
        style: {
            textDecoration: "none",
        },
        whileHover: {
            backgroundColor: "var(--color-text)",
            color: "var(--color-background)",
            boxShadow: glowOnHover ? "0 0 6px var(--color-text)" : "",
        },
        transition: { duration: 0.2 },
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
            glowOnHover={true}
            href={`/projects?tech=${encodeURIComponent(skill)}`}
        />
    );
};

export default Tag;
