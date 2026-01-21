// src/components/sections/contact/SocialItem.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowUpRight, BsCopy } from "react-icons/bs";
import { IoCheckboxOutline } from "react-icons/io5";
import { Social } from "@/data/contactData";

export const SocialItem = ({
    item,
    index,
}: {
    item: Social;
    index: number;
}) => {
    const [copied, setCopied] = useState(false);

    return (
        <motion.div
            className={`flex flex-row items-center w-full border-b`}
            whileHover={{
                backgroundColor: "var(--color-highlight-bg)",
                color: "var(--color-highlight-text)",
            }}
        >
            <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 w-full flex flex-row justify-between group"
                style={{
                    color: "inherit",
                    textDecoration: "none",
                }}
            >
                <div className="flex gap-4">
                    <span>{`${(index + 1).toString().padStart(2, "0")}.`}</span>
                    <span>{item.platform}</span>
                </div>
                <div className="flex items-center gap-4 text-2xl opacity-60 dark:opacity-60">
                    <span className="hidden md:flex">{item.handle}</span>
                    <BsArrowUpRight />
                </div>
            </Link>
            <motion.button
                type="button"
                className="cursor-pointer py-4 pr-4 text-2xl opacity-60 dark:opacity-60"
                onClick={async (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(item.url);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1000);
                }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    scale: copied ? 1.2 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                }}
                aria-label={copied ? `${item.platform} URL copied to clipboard` : `Copy ${item.platform} URL to clipboard`}
            >
                {copied ? <IoCheckboxOutline /> : <BsCopy />}
            </motion.button>
        </motion.div>
    );
};

export const SocialItems = ({ socials }: { socials: Social[] }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center self-center">
            {socials.map((social, index) => (
                <SocialItem key={index} item={social} index={index} />
            ))}
        </div>
    );
};

export default SocialItems;
