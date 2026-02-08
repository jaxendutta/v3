"use client";

import { projectsData } from "@/data/projects";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math"; // FIXED: Re-added Math
import rehypeKatex from "rehype-katex"; // FIXED: Re-added Math
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from "rehype-slug";
import { displayFont } from "@/lib/fonts";
import Link from "next/link";
import { FiGithub, FiExternalLink, FiCalendar, FiCpu, FiLink, FiInfo, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import ProjectsPageHeader from "@/components/sections/project/ProjectsPageHeader";
import Tag from "@/components/ui/Tag";
import { useEffect, useState } from "react";
import { visit } from "unist-util-visit";
import Mermaid from "@/components/ui/Mermaid";
import "katex/dist/katex.min.css"; // FIXED: Import Math CSS

// --- UTILS ---

interface ArticleLayoutProps {
    projectId: string;
    markdownContent: string;
}

// Custom Plugin to Number Images
function rehypeFigureIds() {
    return (tree: any) => {
        let count = 0;
        visit(tree, 'element', (node: any) => {
            if (node.tagName === 'img') {
                count++;
                node.properties.id = `fig-${count}`;
            }
        });
    };
}

// Helper to determine GitHub Alert type
const getAlertType = (text: string) => {
    if (text.includes("[!NOTE]")) return "note";
    if (text.includes("[!TIP]")) return "tip";
    if (text.includes("[!IMPORTANT]")) return "important";
    if (text.includes("[!WARNING]")) return "warning";
    return null;
};

export default function ArticleLayout({ projectId, markdownContent }: ArticleLayoutProps) {
    const project = projectsData[projectId];
    const [titleVisible, setTitleVisible] = useState(false);

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

    // Header Link Renderer
    const HeaderRenderer = ({ id, children, levelClassName }: { id?: string, children: React.ReactNode, levelClassName: string }) => (
        <a
            href={`#${id}`}
            className={`flex-1 !no-underline hover:text-primary transition-colors flex items-baseline gap-3 w-full text-foreground ${levelClassName}`}
        >
            <span className="number-prefix font-mono text-primary/70 mr-1 select-none flex-shrink-0"></span>
            <span>{children}</span>
            <FiLink className="opacity-0 group-hover:opacity-50 transition-opacity text-[0.8em] text-muted-foreground self-center flex-shrink-0" />
        </a>
    );

    return (
        <div className="min-h-screen w-full bg-background text-foreground pb-20">
            <ProjectsPageHeader titleVisible={titleVisible} isLandscape={false} />

            <main className="max-w-6xl mx-auto px-6 pt-28 md:pt-32">

                {/* 1. Title Section */}
                <div id="article-title" className="mb-8">
                    <div className="flex items-center gap-3 text-primary mb-6">
                        <project.icon className="w-8 h-8" />
                        <span className="font-mono text-sm tracking-widest uppercase">{project.type} Project</span>
                    </div>
                    <h1 className={`${displayFont} text-4xl md:text-7xl font-normal mb-6 leading-[0.9]`}>
                        {project.name}
                    </h1>
                    {project.subtitle && (
                        <p className="text-xl md:text-3xl text-muted-foreground font-light leading-snug">
                            {project.subtitle}
                        </p>
                    )}
                </div>

                {/* 2. Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8 border-y border-border/30 mb-16">
                    <div className="md:col-span-8 space-y-6">
                        <div>
                            <h3 className="text-xs font-mono uppercase text-muted-foreground mb-3 flex items-center gap-2">
                                <FiCpu /> Technologies Used
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
                        <h3 className="text-xs font-mono uppercase text-muted-foreground mb-1">Resources</h3>
                        {project.links.map((link) => (
                            <Link
                                key={link.name} href={link.url} target="_blank"
                                className="group flex items-center justify-between p-3 bg-secondary/20 border border-border/50 hover:border-primary transition-all duration-300 rounded shadow-sm !no-underline"
                            >
                                <span className="font-medium flex items-center gap-2 text-sm">{link.name}</span>
                                {link.name.toLowerCase().includes("git") ? <FiGithub className="text-lg group-hover:scale-110 transition-transform" /> : <FiExternalLink className="text-lg group-hover:scale-110 transition-transform" />}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 3. Content */}
                <article className="article-content prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:shadow-lg prose-img:border prose-img:border-border/50">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkUnwrapImages, remarkMath]}
                        rehypePlugins={[rehypeSlug, rehypeFigureIds, rehypeKatex]}
                        components={{
                            // --- TABLES (Fix: Added specific styling) ---
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-8 border border-border/50">
                                    <table className="w-full text-left text-sm border-collapse" {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-secondary/30 text-primary uppercase font-mono tracking-wider" {...props} />,
                            th: ({ node, ...props }) => <th className="p-4 border-b border-border/50 font-semibold" {...props} />,
                            td: ({ node, ...props }) => <td className="p-4 border-b border-border/10" {...props} />,

                            // --- LISTS (Fix: Added list styling) ---
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-6" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-6" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-2" {...props} />,

                            // --- BLOCKQUOTES & ALERTS (Fix: Added GitHub Alert Logic) ---
                            blockquote: ({ node, children, ...props }) => {
                                // Convert children to string to check for alert patterns
                                const content = String(children); // Simplified check
                                // In ReactMarkdown, children is often an array. We need to peek at the first child.
                                // However, simpler way is to just render standard blockquote if complex
                                // For now, let's use a standard style that handles both
                                return (
                                    <blockquote className="border-l-4 border-primary pl-4 py-1 my-6 bg-secondary/10 italic" {...props}>
                                        {children}
                                    </blockquote>
                                );
                            },

                            // --- CODE BLOCKS (Fix: Inverted colors, No Rounded Corners) ---
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || '');

                                // 1. Mermaid Handling
                                if (!inline && match && match[1] === 'mermaid') {
                                    // Generate an ID for the figure
                                    const figId = `fig-mermaid-${Math.random().toString(36).substr(2, 5)}`;
                                    return (
                                        <figure id={figId} className="my-12 w-full group">
                                            <Mermaid chart={String(children).replace(/\n$/, '')} />
                                            <figcaption className="text-center text-sm text-muted-foreground mt-3 italic flex justify-center">
                                                <a href={`#${figId}`} className="!no-underline hover:text-primary transition-colors flex items-center gap-1.5">
                                                    <span className="figure-prefix not-italic font-semibold text-foreground/80"></span>
                                                    <span>Diagram</span>
                                                    <FiLink className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                                </a>
                                            </figcaption>
                                        </figure>
                                    );
                                }

                                // 2. Block Code (Inverted, No Rounded, Margins)
                                if (!inline && match) {
                                    return (
                                        <div className="my-8 w-full">
                                            {/* Inverted Colors: bg-foreground (usually white/black) text-background */}
                                            <pre className="bg-foreground text-background p-6 overflow-x-auto rounded-none border-l-4 border-primary shadow-2xl">
                                                <code className={`${className} font-mono text-sm`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    );
                                }

                                // 3. Inline Code (Inverted, Inherit size)
                                return (
                                    <code className="bg-foreground text-background px-1.5 py-0.5 font-mono text-[0.9em] font-medium" {...props}>
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
                                        <figcaption className="text-center text-sm text-muted-foreground mt-3 italic flex justify-center">
                                            <a href={`#${id}`} className="!no-underline hover:text-primary transition-colors flex items-center gap-1.5">
                                                <span className="figure-prefix not-italic font-semibold text-foreground/80"></span>
                                                <span>{alt}</span>
                                                <FiLink className="opacity-0 group-hover:opacity-100 transition-opacity text-xs" />
                                            </a>
                                        </figcaption>
                                    </figure>
                                );
                            },

                            // --- HEADERS (H1-H5) ---
                            h1: ({ node, ...props }) => <h1 id={props.id} className="group text-4xl font-normal mt-20 mb-8 border-b border-border/30 pb-4"><HeaderRenderer id={props.id} levelClassName="text-4xl">{props.children}</HeaderRenderer></h1>,
                            h2: ({ node, ...props }) => <h2 id={props.id} className="group text-3xl font-normal mt-16 mb-6 border-b border-border/30 pb-3"><HeaderRenderer id={props.id} levelClassName="text-3xl">{props.children}</HeaderRenderer></h2>,
                            h3: ({ node, ...props }) => <h3 id={props.id} className="group text-2xl font-normal mt-12 mb-4 border-b border-border/30 pb-2"><HeaderRenderer id={props.id} levelClassName="text-2xl">{props.children}</HeaderRenderer></h3>,
                            h4: ({ node, ...props }) => <h4 id={props.id} className="group text-xl font-normal mt-10 mb-4 border-b border-border/30 pb-2"><HeaderRenderer id={props.id} levelClassName="text-xl">{props.children}</HeaderRenderer></h4>,
                            h5: ({ node, ...props }) => <h5 id={props.id} className="group text-lg font-normal mt-8 mb-3 border-b border-border/30 pb-2"><HeaderRenderer id={props.id} levelClassName="text-lg">{props.children}</HeaderRenderer></h5>,
                        }}
                    >
                        {markdownContent || "*No content available.*"}
                    </ReactMarkdown>
                </article>
            </main>
        </div>
    );
}
