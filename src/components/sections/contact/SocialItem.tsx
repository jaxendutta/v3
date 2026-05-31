// src/components/sections/contact/SocialItem.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BsArrowUpRight } from "react-icons/bs";
import { Social } from "@/types/contact";
import { PiCheckSquare, PiCopySimple, PiFilePdf, PiDownloadSimple } from "react-icons/pi";

export interface SocialItemProps {
    item: Social;
    index: number;
    copy?: boolean;
    className?: string;
}

export const SocialItem = ({ item, index, copy = true, className = "" }: SocialItemProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboardFallback = (text: string) => {
        const result = window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
        if (result !== null) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    const copyUrl = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(item.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
            } catch (err) {
                console.error("Failed to copy: ", err);
                copyToClipboardFallback(item.url);
            }
        } else {
            copyToClipboardFallback(item.url);
        }
    };

    return (
        <motion.div
            className={`flex flex-row items-center w-full border-b ${className}`}
            whileHover={{
                backgroundColor: "var(--color-highlight-bg)",
                color: "var(--color-highlight-text)",
            }}
        >
            {/* Label */}
            <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="py-[0.5em] pl-[0.5em] pr-2 flex-1 min-w-0"
                style={{ color: "inherit", textDecoration: "none" }}
            >
                <div className="flex gap-4">
                    <span className="opacity-60 flex-shrink-0">
                        {(index + 1).toString().padStart(2, "0")}.
                    </span>
                    <span>
                        {item.labelShort
                            ? <><span className="md:hidden">{item.labelShort}</span><span className="hidden md:inline">{item.label}</span></>
                            : item.label
                        }
                    </span>
                </div>
            </Link>

            {/* Handle: desktop only */}
            {item.handle && (
                <span className="hidden md:flex text-[0.75em] opacity-60 pr-3 flex-shrink-0">
                    {item.handle}
                </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 px-3 flex-shrink-0">
                {item.localPdf && (
                    <Link
                        href={item.localPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="opacity-60 dark:opacity-60 hover:opacity-100 transition-opacity"
                        style={{ color: "inherit", textDecoration: "none" }}
                        title="View PDF"
                    >
                        <PiFilePdf />
                    </Link>
                )}

                {item.downloadUrl && (
                    <a
                        href={item.downloadUrl}
                        download
                        className="opacity-60 dark:opacity-60 hover:opacity-100 transition-opacity"
                        style={{ color: "inherit", textDecoration: "none" }}
                        title="Download"
                    >
                        <PiDownloadSimple />
                    </a>
                )}

                <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-60 dark:opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: "inherit", textDecoration: "none" }}
                    title={`Open ${item.label}`}
                >
                    <BsArrowUpRight />
                </Link>

                {copy && (
                    <motion.button
                        type="button"
                        className="cursor-pointer opacity-60 dark:opacity-60"
                        onClick={copyUrl}
                        whileTap={{ scale: 0.9 }}
                        animate={{ scale: copied ? 1.2 : 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        aria-label={copied ? `${item.label} URL copied` : `Copy ${item.label} URL`}
                    >
                        {copied ? <PiCheckSquare /> : <PiCopySimple />}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export const SocialItems = ({ socials, className = "" }: { socials: Social[]; className?: string }) => {
    return (
        <div className="w-full flex flex-col items-center justify-center self-center">
            {socials.map((social, index) => (
                <SocialItem key={index} item={social} index={index} className={className} />
            ))}
        </div>
    );
};

export default SocialItems;
