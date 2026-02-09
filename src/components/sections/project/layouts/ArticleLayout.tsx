"use client";

import { projectsData } from "@/data/projects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from "rehype-slug";
import { displayFont } from "@/lib/fonts";
import Link from "next/link";
import {
    FiGithub, FiExternalLink, FiCalendar, FiCpu, FiLink,
    FiInfo, FiAlertCircle, FiCheckCircle, FiAlertTriangle, FiBookmark
} from "react-icons/fi";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Tag from "@/components/ui/Tag";
import { useEffect, useState } from "react";
import { visit } from "unist-util-visit";
import Mermaid from "@/components/ui/Mermaid";
import "katex/dist/katex.min.css";
import Footer from "@/components/layout/Footer";

// --- PLUGINS ---

// 1. Remark Plugin: Detect GitHub Alerts (Note, Tip, etc.)
// This runs on the Markdown AST *before* it becomes HTML.
function remarkAlerts() {
    return (tree: any) => {
        visit(tree, 'blockquote', (node: any) => {
            const firstChild = node.children?.[0];
            if (!firstChild || firstChild.type !== 'paragraph') return;

            const firstTextNode = firstChild.children?.[0];
            if (!firstTextNode || firstTextNode.type !== 'text') return;

            const content = firstTextNode.value;
            // Regex to find [!NOTE], [!TIP], etc.
            const match = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

            if (match) {
                const type = match[1].toLowerCase();

                // Inject a data attribute we can read in React
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties['data-alert-type'] = type;

                // Strip the "[!NOTE]" text from the content so it doesn't render
                // We assume there might be a newline or space after it
                const cleanContent = content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s?/, "");
                firstTextNode.value = cleanContent;
            }
        });
    };
}

// 2. Rehype Plugin: Auto-number Images and Mermaid charts (Figure 1, Figure 2...)
function rehypeFigureIds() {
    return (tree: any) => {
        let count = 0;
        visit(tree, 'element', (node: any) => {
            // 1. Check for standard Images
            if (node.tagName === 'img') {
                count++;
                node.properties.id = `fig-${count}`;
                return;
            }

            // 2. Check for Mermaid Code Blocks
            // Markdown code blocks become <code class="language-mermaid"> in rehype
            if (node.tagName === 'code' && node.properties?.className) {
                const classes = Array.isArray(node.properties.className)
                    ? node.properties.className
                    : [node.properties.className];

                if (classes.includes('language-mermaid')) {
                    count++;
                    // Inject the ID into the node properties so React props receive it
                    node.properties.id = `fig-${count}`;
                }
            }
        });
    };
}

// --- CONFIG ---

const ALERT_STYLES: Record<string, { icon: any, classes: string, title: string }> = {
    note: {
        icon: FiInfo,
        classes: "bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-300",
        title: "Note"
    },
    tip: {
        icon: FiCheckCircle,
        classes: "bg-green-500/10 border-green-500 text-green-900 dark:text-green-300",
        title: "Tip"
    },
    important: {
        icon: FiBookmark,
        classes: "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-300",
        title: "Important"
    },
    warning: {
        icon: FiAlertTriangle,
        classes: "bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300",
        title: "Warning"
    },
    caution: {
        icon: FiAlertCircle,
        classes: "bg-red-500/10 border-red-500 text-red-700 dark:text-red-300",
        title: "Caution"
    }
};

interface ArticleLayoutProps {
    projectId: string;
    markdownContent: string;
}

export default function ArticleLayout({ projectId, markdownContent }: ArticleLayoutProps) {
    const project = projectsData[projectId];
    const [titleVisible, setTitleVisible] = useState(false);
    const base_font_size = "text-xs md:text-sm";

    useEffect(() => {
        const handleScroll = () => {
            const titleElement = document.getElementById("article-title");
            if (titleElement) {
                const rect = titleElement.getBoundingClientRect();
                setTitleVisible(rect.bottom < 0);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!project) return null;

    // Helper for Headers with Links
    const HeaderRenderer = ({ id, children, levelClassName }: { id?: string, children: React.ReactNode, levelClassName: string }) => (
        <a
            href={`#${id}`}
            className={`flex-1 !no-underline hover:text-primary transition-colors flex items-baseline gap-3 w-full text-foreground ${levelClassName}`}
        >
            <span className="number-prefix font-mono text-primary/70 mr-1 select-none flex-shrink-0"></span>
            <span>{children}</span>
            <FiLink className="opacity-0 group-hover:opacity-50 transition-opacity text-[0.5em] text-muted-foreground self-center flex-shrink-0" />
        </a>
    );

    return (
        <div className={`min-h-screen w-full bg-background text-foreground`}>
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={false} />

            <main className="md:max-w-3xl lg:max-w-5xl mx-auto px-6 pt-28 md:pt-32">

                {/* 1. Header Section */}
                <div id="article-title" className="mb-8">
                    <div className="font-mono text-sm tracking-widest uppercase text-primary mb-6">{project.type} Project</div>
                    <h1 className={`${displayFont} text-4xl md:text-7xl font-normal mb-2 md:mb-6 leading-[0.9] italic! flex gap-2`}>
                        <project.icon />
                        {project.name}
                    </h1>
                    {project.subtitle && (
                        <p className={`${displayFont} text-xl md:text-3xl text-muted-foreground font-light italic!`}>
                            {project.subtitle}
                        </p>
                    )}
                </div>

                {/* 2. Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-4 md:py-8 border-y border-border/30 mb-16">
                    <div className="md:col-span-8 space-y-6">
                        <div>
                            <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                <FiCpu /> Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack && Object.values(project.techStack).flat().map((tech) => (
                                    <Tag key={tech.name} text={tech.name} />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
                            <FiCalendar />
                            <span>Published: {project.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-3">
                        <h3 className="text-xs font-mono uppercase text-muted-foreground mb-1">LINKS</h3>
                        {project.links.map((link) => (
                            <Link
                                key={link.name} href={link.url} target="_blank"
                                className="group flex items-center justify-between p-3 border border-border/50 hover:border-primary transition-all duration-300 !no-underline"
                            >
                                <span className="font-medium flex items-center gap-2 text-sm">{link.name}</span>
                                {link.name.toLowerCase().includes("git") ? <FiGithub className="text-lg transition-transform" /> : <FiExternalLink className="text-lg transition-transform" />}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 3. Article Content */}
                <article className="article-content prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:scroll-mt-28 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:border prose-img:border-border/50
                ">
                    <ReactMarkdown
                        // Added remarkAlerts here to process the tags
                        remarkPlugins={[remarkGfm, remarkUnwrapImages, remarkMath, remarkAlerts]}
                        rehypePlugins={[rehypeSlug, rehypeFigureIds, rehypeKatex]}
                        components={{
                            // --- ALERTS & BLOCKQUOTES ---
                            blockquote: ({ node, children, ...props }: any) => {
                                // Retrieve the data attribute injected by our remark plugin
                                const alertType = props['data-alert-type'] as string;

                                if (alertType && ALERT_STYLES[alertType]) {
                                    const style = ALERT_STYLES[alertType];
                                    const Icon = style.icon;

                                    return (
                                        <div className={`my-8 p-2 md:p-4 border-l-4 ${style.classes} flex flex-col gap-2 md:gap-4 items-start`}>
                                            <div className="w-full flex items-center gap-2 text-sm">
                                                <Icon className="flex-shrink-0" />
                                                <p className="font-bold opacity-90 uppercase tracking-wide">{style.title}</p>
                                            </div>
                                            <div className="opacity-90 [&>p]:my-0">{children}</div>
                                        </div>
                                    );
                                }

                                // Standard Quote
                                return (
                                    <blockquote className="border-l-4 border-primary pl-4 py-2 my-8 bg-secondary/10 italic text-muted-foreground" {...props}>
                                        {children}
                                    </blockquote>
                                );
                            },

                            // --- TABLES ---
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-4 md:my-12 border-t border-l border-border/50">
                                    <table className={`w-full text-left ${base_font_size}`} {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-secondary uppercase font-mono tracking-wider" {...props} />,
                            th: ({ node, ...props }) => <th className="p-4 border-b border-r border-border/50 font-semibold" {...props} />,
                            td: ({ node, ...props }) => <td className="p-4 border-b border-r border-border/50" {...props} />,

                            // --- LISTS ---
                            ul: ({ node, ...props }) => <ul className={`list-disc pl-4 md:pl-6 space-y-2 my-4 md:my-6 marker:text-primary ${base_font_size}`} {...props} />,
                            ol: ({ node, ...props }) => <ol className={`list-decimal pl-6 space-y-2 my-4 md:my-6 marker:text-primary ${base_font_size}`} {...props} />,
                            li: ({ node, ...props }) => <li className="md:pl-2" {...props} />,

                            // --- CODE BLOCKS ---
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');
                                const codeString = String(children).replace(/\n$/, '');

                                // --- MERMAID HANDLING ---
                                if (!inline && match && match[1] === 'mermaid') {
                                    const figId = props.id || `fig-mermaid-${Math.random().toString(36).substring(2, 9)}`;

                                    // 1. Extract Title: Look for YAML-style title block at start
                                    let title = "Diagram";
                                    let cleanCode = codeString;

                                    // Regex for:
                                    // ---
                                    // title: My Title
                                    // ---
                                    const titleMatch = codeString.match(/^---\s*[\r\n]+title:\s*(.+)[\r\n]+---\s*[\r\n]+([\s\S]*)/);

                                    if (titleMatch) {
                                        title = titleMatch[1].trim();
                                        cleanCode = titleMatch[2]; // Code without title block
                                    }

                                    return (
                                        <figure id={figId} className="my-12 w-full group">
                                            {/* Pass clean code to Mermaid so it doesn't double-render title */}
                                            <Mermaid chart={cleanCode} />
                                            <figcaption className="text-center text-xs md:text-sm text-muted-foreground mt-3 italic flex justify-center">
                                                <a href={`#${figId}`} className="!no-underline hover:text-primary transition-colors flex items-center gap-1.5">
                                                    <span className="figure-prefix not-italic font-semibold text-foreground/80"></span>
                                                    <span>{title}</span>
                                                    <FiLink className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                                </a>
                                            </figcaption>
                                        </figure>
                                    );
                                }

                                // Standard Code Blocks
                                if (!inline && match) {
                                    return (
                                        <div className="my-4 md:my-10 w-full group relative">
                                            <pre className="bg-gray-800 text-white p-2 md:p-6 overflow-x-auto">
                                                {/* Language Label */}
                                                <div className="absolute top-0 right-0 px-1 md:px-3 md:py-1 bg-primary text-primary-foreground text-[8px] md:text-xs font-mono md:opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center flex">
                                                    {match[1]}
                                                </div>
                                                <code className={`${className} leading-[0]! font-mono ${base_font_size}`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    );
                                }

                                // Inline Code
                                return (
                                    <code className="bg-foreground text-background px-1.5 py-0.5 font-mono text-[0.95em] font-medium text-wrap" {...props}>
                                        {children}
                                    </code>
                                );
                            },

                            // --- IMAGES ---
                            img: ({ node, ...props }) => {
                                const rawSrc = typeof props.src === 'string' ? props.src : "";
                                if (!rawSrc) return null;
                                const src = rawSrc.startsWith('/') ? rawSrc : `/images/projects/${projectId}/${rawSrc}`;
                                const alt = props.alt || "Figure";
                                const id = props.id || "fig-unknown";
                                return (
                                    <figure id={id} className="my-12 w-full group">
                                        <img {...props} src={src} className="w-full h-auto rounded-none border border-border/40" alt={alt} />
                                        <figcaption className="text-center text-xs md:text-sm text-muted-foreground mt-3 italic flex justify-center">
                                            <a href={`#${id}`} className="!no-underline hover:text-primary transition-colors flex inline-flex items-center gap-1.5">
                                                <span className="figure-prefix not-italic font-semibold text-foreground/80 inline-flex"></span>
                                                <span>{alt}</span>
                                                <FiLink className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        </figcaption>
                                    </figure>
                                );
                            },

                            // --- HEADERS ---
                            h1: ({ node, ...props }) => <h1 id={props.id} className="group font-normal mt-8 md:mt-16 mb-4 md:mb-8 border-b border-border pb-2 md:pb-4"><HeaderRenderer id={props.id} levelClassName="text-xl md:text-3xl lg:text-4xl">{props.children}</HeaderRenderer></h1>,
                            h2: ({ node, ...props }) => <h2 id={props.id} className="group font-normal mt-4 md:mt-12 mb-4 md:mb-6 border-b border-border pb-3"><HeaderRenderer id={props.id} levelClassName="text-lg md:text-2xl lg:text-3xl">{props.children}</HeaderRenderer></h2>,
                            h3: ({ node, ...props }) => <h3 id={props.id} className="group font-normal mt-5 md:mt-8 mb-2 md:mb-4 border-b border-border pb-2"><HeaderRenderer id={props.id} levelClassName="text-base md:text-xl lg:text-2xl">{props.children}</HeaderRenderer></h3>,
                            h4: ({ node, ...props }) => <h4 id={props.id} className="group font-normal mt-4 md:mt-6 mb-4 border-b border-border pb-2"><HeaderRenderer id={props.id} levelClassName="text-sm md:text-xl lg:text-xl">{props.children}</HeaderRenderer></h4>,
                            h5: ({ node, ...props }) => <h5 id={props.id} className="group font-normal mt-4 mb-3 border-b border-border pb-2"><HeaderRenderer id={props.id} levelClassName="text-xs md:text-md lg:text-lg">{props.children}</HeaderRenderer></h5>,

                            p: ({ node, ...props }) => <p className="text-xs md:text-sm my-1 md:my-6 tracking-wide leading-normal text-justify" {...props} />,
                        }}
                    >
                        {markdownContent || "*No content available.*"}
                    </ReactMarkdown>
                </article>
            </main>
            <Footer className="w-full border-t border-border mt-20 relative z-10" />
        </div>
    );
}
